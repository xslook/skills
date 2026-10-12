# Error Handling & Concurrency Safety Specification

---

## 1. Modern Error Handling Specification

### 1.1 Error Wrapping (`%w`)
- When returning errors up intermediate layers, **wrap with `%w`** to preserve root causes for `errors.Is` / `errors.As`.
- Format standard: `fmt.Errorf("<action> <context_identifier>: %w", ..., err)`. Use lowercase, no trailing punctuation, no "failed to" prefix (the chain already implies failure).
- Don't repeat context the caller already adds (e.g. don't prefix with the function's own package name at every level).
- **Deliberate `%v` exception**: At a public API or system boundary where callers must *not* depend on internal errors (e.g. hiding a driver error behind your package's contract), translate to your own sentinel/type, or format with `%v` intentionally and document why.

```go
// ✅ Good: States operation intent, subject identifier, and wraps the error
if _, err := r.db.ExecContext(ctx, query, orderID); err != nil {
    return fmt.Errorf("update order status %s: %w", orderID, err)
}

// ❌ Bad: %v erases the chain, so errors.Is(err, sql.ErrNoRows) no longer works upstream
if err != nil {
    return fmt.Errorf("db error: %v", err)
}
```

### 1.2 Error Matching: `errors.Is`, `errors.As`, `errors.AsType`
- **Never** use `err == ErrNotFound` for sentinel comparison (fails once the error is wrapped).
- **Never** use `strings.Contains(err.Error(), "not found")` to inspect error categories.
- Name sentinels `ErrXxx` and error types `XxxError` (enforced by the `errname` linter).

```go
// 1. Sentinel error inspection
var ErrNotFound = errors.New("resource not found")

if errors.Is(err, ErrNotFound) {
    // 404 branch
}

// 2. Custom error type extraction
type ValidationError struct {
    Field string
    Rule  string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("field %s failed rule %s", e.Field, e.Rule)
}

// Go 1.26+: generic, type-safe, no pre-declared target variable
if valErr, ok := errors.AsType[*ValidationError](err); ok {
    slog.WarnContext(ctx, "invalid input", "field", valErr.Field)
}

// Go < 1.26 equivalent
var valErr *ValidationError
if errors.As(err, &valErr) {
    slog.WarnContext(ctx, "invalid input", "field", valErr.Field)
}
```

### 1.3 Combining Errors
- Use `errors.Join(errs...)` to return several independent failures (e.g. validating many fields, closing several resources). `errors.Is` matches any joined member.
- Capture `Close()` errors on writable resources, where a failed close can mean data was lost:

```go
func writeReport(path string, data []byte) (err error) {
    f, err := os.Create(path)
    if err != nil {
        return fmt.Errorf("create report %s: %w", path, err)
    }
    defer func() {
        // A failed Close on a written file can mean data loss; never drop it.
        err = errors.Join(err, f.Close())
    }()

    if _, err := f.Write(data); err != nil {
        return fmt.Errorf("write report %s: %w", path, err)
    }
    return nil
}
```

### 1.4 Production Domain Error Pattern
```go
// Package apperrors defines transport-agnostic application error categories.
package apperrors

import (
	"errors"
	"fmt"
)

// Code is a stable, machine-readable error category.
type Code string

const (
	CodeNotFound     Code = "NOT_FOUND"
	CodeInvalidArg   Code = "INVALID_ARGUMENT"
	CodeUnauthorized Code = "UNAUTHORIZED"
	CodeConflict     Code = "CONFLICT"
	CodeInternal     Code = "INTERNAL"
)

// Error carries a category, a safe client-facing message, and the wrapped cause.
type Error struct {
	Code    Code
	Message string // Safe to show to clients; never include internal details.
	Err     error  // Internal cause; logged, never returned to clients.
}

func (e *Error) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %s: %v", e.Code, e.Message, e.Err)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func (e *Error) Unwrap() error { return e.Err }

// NotFound builds a CodeNotFound error.
func NotFound(msg string, cause error) *Error {
	return &Error{Code: CodeNotFound, Message: msg, Err: cause}
}

// CodeOf extracts the category of err, defaulting to CodeInternal.
func CodeOf(err error) Code {
	if e, ok := errors.AsType[*Error](err); ok {
		return e.Code
	}
	return CodeInternal
}
```

Keep HTTP/gRPC status codes **out** of the domain error. Map `Code → status` once, in the transport layer:

```go
// internal/handler/errors.go
func httpStatus(err error) int {
	switch apperrors.CodeOf(err) {
	case apperrors.CodeNotFound:
		return http.StatusNotFound
	case apperrors.CodeInvalidArg:
		return http.StatusBadRequest
	case apperrors.CodeUnauthorized:
		return http.StatusUnauthorized
	case apperrors.CodeConflict:
		return http.StatusConflict
	default:
		return http.StatusInternalServerError
	}
}
```

---

## 2. Concurrency & Goroutine Safety

### 2.1 Golden Rule: No Orphan Goroutines
Every `go` statement must have **an owner that waits for it** and **a way to stop it**:
1. **Stop**: the goroutine exits on `<-ctx.Done()`, on channel close, or because its work is finite.
2. **Wait**: its owner joins it via `sync.WaitGroup`, `errgroup.Group`, or a done/result channel before returning or shutting down.

A function that starts a goroutine and returns without giving the caller a way to wait for it is a leak, even if the goroutine watches `ctx`.

### 2.2 `sync.WaitGroup.Go` (Go 1.25+)
```go
// ✅ Go 1.25+: Add/Done are handled for you; no forgotten Done or misplaced Add
var wg sync.WaitGroup
for _, item := range items {
    wg.Go(func() {
        process(ctx, item)
    })
}
wg.Wait()

// ❌ Outdated pattern (still correct, but error-prone and verbose)
for _, item := range items {
    wg.Add(1)
    go func() {
        defer wg.Done()
        process(ctx, item)
    }()
}
```

### 2.3 Parallel Work with `errgroup` (Errors + Cancellation + Bounded Concurrency)
Use `golang.org/x/sync/errgroup` whenever tasks can fail. Use **`SetLimit`** whenever the number of tasks depends on input size, so a 10,000-item batch doesn't open 10,000 connections.

```go
func (s *AggregatorService) FetchDashboard(ctx context.Context, userID string) (*Dashboard, error) {
	// The derived ctx is canceled as soon as any task returns an error.
	g, ctx := errgroup.WithContext(ctx)

	var (
		profile *Profile
		orders  []*Order
	)

	// Each goroutine writes a distinct variable, and g.Wait() establishes
	// happens-before, so no mutex is needed.
	g.Go(func() error {
		p, err := s.users.GetProfile(ctx, userID)
		if err != nil {
			return fmt.Errorf("fetch profile for user %s: %w", userID, err)
		}
		profile = p
		return nil
	})

	g.Go(func() error {
		o, err := s.orders.ListOrders(ctx, userID)
		if err != nil {
			return fmt.Errorf("fetch orders for user %s: %w", userID, err)
		}
		orders = o
		return nil
	})

	if err := g.Wait(); err != nil {
		return nil, err
	}
	return &Dashboard{Profile: profile, Orders: orders}, nil
}

// Bounded fan-out over input of arbitrary size, writing results by index (no lock needed).
func (s *Service) EnrichAll(ctx context.Context, ids []string) ([]*Item, error) {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(8) // Caps concurrent downstream calls; tune to the dependency's capacity.

	results := make([]*Item, len(ids))
	for i, id := range ids {
		g.Go(func() error {
			item, err := s.client.Get(ctx, id)
			if err != nil {
				return fmt.Errorf("enrich item %s: %w", id, err)
			}
			results[i] = item
			return nil
		})
	}
	if err := g.Wait(); err != nil {
		return nil, err
	}
	return results, nil
}
```

### 2.4 Long-Running Workers: Owned Lifecycle + Per-Job Panic Recovery
- Recover **per job**, not per goroutine. A goroutine-level `recover` kills the worker for good after the first panic and leaves the queue undrained.
- The caller must be able to wait for workers to stop (e.g. during graceful shutdown).

```go
// RunWorkers processes jobs with n workers until ctx is canceled or jobs is closed.
// It blocks until every worker has exited, so callers can run it under an errgroup
// or a WaitGroup in main and get clean shutdown.
func RunWorkers(ctx context.Context, n int, jobs <-chan Job) {
	var wg sync.WaitGroup
	for range n {
		wg.Go(func() {
			for {
				select {
				case <-ctx.Done():
					return
				case job, ok := <-jobs:
					if !ok {
						return
					}
					processSafely(ctx, job)
				}
			}
		})
	}
	wg.Wait()
}

// processSafely isolates a single job so one bad record can't crash the process
// or stop the worker.
func processSafely(ctx context.Context, job Job) {
	defer func() {
		if r := recover(); r != nil {
			slog.ErrorContext(ctx, "job panicked",
				slog.String("job_id", job.ID),
				slog.Any("panic", r),
				slog.String("stack", string(debug.Stack())),
			)
		}
	}()
	if err := processJob(ctx, job); err != nil {
		slog.ErrorContext(ctx, "job failed", slog.String("job_id", job.ID), slog.Any("error", err))
	}
}
```

> [!NOTE]
> `net/http` already recovers panics in handlers. Don't add recovery middleware just to keep the server alive. Add it only to turn panics into structured logs or 500 responses.

### 2.5 Channel Ownership Rules
1. **The sender owns closing**: only the (single) sending side closes a channel, and only when no more sends can happen. With multiple senders, close after `wg.Wait()` in a dedicated goroutine.
2. **Receivers never close channels**. Sending on a closed channel panics.
3. Use `chan struct{}` for pure signals. Use typed channels for payloads.
4. Every blocking send/receive in a goroutine must also `select` on `ctx.Done()`, or the goroutine leaks when the other side gives up.
5. Default to unbuffered channels. A buffer size needs a documented reason (e.g. absorbing bursts), not "for performance".

### 2.6 Shared State
- Protect shared mutable state with `sync.Mutex`/`sync.RWMutex` held for the shortest critical section. Never copy a struct that contains a mutex (`go vet` copylocks). Pass it by pointer.
- Use `sync/atomic` typed values (`atomic.Int64`, `atomic.Bool`, `atomic.Pointer[T]`) for simple counters and flags.
- Use `sync.OnceValue` / `sync.OnceValues` (Go 1.21+) for lazy initialization instead of `sync.Once` plus a package variable.
- Use `context.AfterFunc` (Go 1.21+) to run cleanup when a context is canceled, without dedicating a goroutine to wait.
- Use `context.WithoutCancel(ctx)` (Go 1.21+) for work that must outlive the request (e.g. audit writes after the response) while keeping its values (trace IDs).
- Always run `go test -race` in CI. A race report is a bug, never a flaky test.
