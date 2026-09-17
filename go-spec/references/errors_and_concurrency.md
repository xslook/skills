# Error Handling & Concurrency Safety Specification

---

## 1. Modern Error Handling Specification

### 1.1 Error Wrapping (`%w`)
- When returning errors up intermediate layers, **always wrap with `%w`** to preserve root causes.
- Format standard: `fmt.Errorf("<action> <context_identifier>: %w", ..., err)`.
- Never format errors with `%v` or `%s` (breaks `errors.Is` and `errors.As`).

```go
// ✅ Good: States operational intent, subject identifier, and wraps the error
if err := r.db.ExecContext(ctx, query, orderID).Error; err != nil {
    return fmt.Errorf("execute update order status %s: %w", orderID, err)
}

// ❌ Bad: Erases error root cause, preventing errors.Is checks
if err != nil {
    return fmt.Errorf("db error: %v", err)
}
```

### 1.2 Error Matching: `errors.Is` & `errors.As`
- **Never** use `err == ErrNotFound` for sentinel error comparison (cannot unwrap errors wrapped with `%w`).
- **Never** use `strings.Contains(err.Error(), "not found")` to inspect error categories.

```go
// 1. Sentinel Error Inspection
var ErrNotFound = errors.New("resource not found")

if errors.Is(err, ErrNotFound) {
    // Matches 404 branch
}

// 2. Custom Error Struct Extraction
type ValidationError struct {
    Field string
    Rule  string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("field %s failed on rule %s", e.Field, e.Rule)
}

var valErr *ValidationError
if errors.As(err, &valErr) {
    slog.WarnContext(ctx, "invalid input", "field", valErr.Field)
}
```

### 1.3 Production Domain Error Pattern
```go
package apperrors

import (
	"errors"
	"fmt"
	"net/http"
)

type ErrorCode string

const (
	CodeNotFound      ErrorCode = "NOT_FOUND"
	CodeInvalidArg    ErrorCode = "INVALID_ARGUMENT"
	CodeUnauthorized  ErrorCode = "UNAUTHORIZED"
	CodeInternalError ErrorCode = "INTERNAL_SERVER_ERROR"
)

type AppError struct {
	Code       ErrorCode
	Message    string
	HTTPStatus int
	Err        error
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("[%s] %s: %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("[%s] %s", e.Code, e.Message)
}

func (e *AppError) Unwrap() error {
	return e.Err
}

func NewNotFoundError(message string, originalErr error) *AppError {
	return &AppError{
		Code:       CodeNotFound,
		Message:    message,
		HTTPStatus: http.StatusNotFound,
		Err:        originalErr,
	}
}
```

---

## 2. Concurrency & Goroutine Safety

### 2.1 Golden Rule: No Orphan Goroutines
Whenever launching `go func()`, at least one of the following lifecycle guarantees must be in place:
1. Triggered and terminated cleanly via parent `context.Context` (`<-ctx.Done()`);
2. Tracked and joined using `sync.WaitGroup` or `errgroup.Group`;
3. Short-lived task guaranteed to return via channel synchronization before the parent request completes.

### 2.2 Recommended Pattern: Orchestrating Parallel Work with `errgroup`
For aggregated APIs, batch operations, or parallel network requests, use `golang.org/x/sync/errgroup`:

```go
package service

import (
	"context"
	"fmt"

	"golang.org/x/sync/errgroup"
)

type AggregatedData struct {
	UserProfile  *Profile
	OrderHistory []*Order
}

func (s *AggregatorService) FetchDashboard(ctx context.Context, userID string) (*AggregatedData, error) {
	// Create context-bound errgroup; if any task errors, remaining tasks are cancelled
	g, ctx := errgroup.WithContext(ctx)

	var (
		profile *Profile
		orders  []*Order
	)

	// Parallel Task 1: Fetch user profile
	g.Go(func() error {
		p, err := s.userClient.GetProfile(ctx, userID)
		if err != nil {
			return fmt.Errorf("fetch profile for user %s: %w", userID, err)
		}
		profile = p
		return nil
	})

	// Parallel Task 2: Fetch order history
	g.Go(func() error {
		o, err := s.orderClient.ListOrders(ctx, userID)
		if err != nil {
			return fmt.Errorf("fetch orders for user %s: %w", userID, err)
		}
		orders = o
		return nil
	})

	// Wait for all tasks to finish
	if err := g.Wait(); err != nil {
		return nil, err
	}

	return &AggregatedData{
		UserProfile:  profile,
		OrderHistory: orders,
	}, nil
}
```

### 2.3 Goroutine Panic Recovery
Long-running background worker goroutines (Workers / Consumers) must install `defer recover()` at their entrypoint to prevent single-record exceptions from crashing the entire application process:

```go
func StartWorker(ctx context.Context, jobQueue <-chan Job) {
	go func() {
		defer func() {
			if r := recover(); r != nil {
				slog.Error("worker recovered from unexpected panic",
					slog.Any("panic_value", r),
					slog.String("stack", string(debug.Stack())),
				)
			}
		}()

		for {
			select {
			case <-ctx.Done():
				slog.Info("worker gracefully stopped by context")
				return
			case job, ok := <-jobQueue:
				if !ok {
					slog.Info("job queue channel closed, worker exiting")
					return
				}
				processJob(job)
			}
		}
	}()
}
```

### 2.4 Channel Ownership Rules
1. **The Creator Owns Closing**: Only the goroutine that creates and writes to a channel has the authority to call `close(ch)`.
2. **Receivers Never Close Channels**; senders must never write to closed channels (which triggers a panic).
3. Use `chan struct{}` for pure notification/cancellation signals; use typed channels when transmitting payloads.
