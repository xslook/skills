# Testing & Quality Gates Specification

---

## 1. Table-Driven Tests Standard

All functions containing branching or business logic must use **Table-Driven Tests**.

### Standard Test Template
```go
package service_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestUserService_Register(t *testing.T) {
	t.Parallel() // Enable parallel test execution

	type args struct {
		email    string
		password string
	}

	tests := []struct {
		name       string
		args       args
		setupMocks func(m *MockUserRepo)
		wantUserID string
		wantErr    error
	}{
		{
			name: "successful registration",
			args: args{
				email:    "user@example.com",
				password: "SecurePassword123!",
			},
			setupMocks: func(m *MockUserRepo) {
				// Use mock.Anything for context parameter to avoid brittle exact-context matches
				m.EXPECT().
					FindByEmail(mock.Anything, "user@example.com").
					Return(nil, ErrUserNotFound)
				m.EXPECT().
					Create(mock.Anything, mock.Anything).
					Return("usr-1001", nil)
			},
			wantUserID: "usr-1001",
			wantErr:    nil,
		},
		{
			name: "email already registered",
			args: args{
				email:    "existing@example.com",
				password: "SecurePassword123!",
			},
			setupMocks: func(m *MockUserRepo) {
				m.EXPECT().
					FindByEmail(mock.Anything, "existing@example.com").
					Return(&User{ID: "usr-0001"}, nil)
			},
			wantUserID: "",
			wantErr:    ErrEmailAlreadyExists,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			// 1. Initialize mock and system under test (SUT)
			mockRepo := NewMockUserRepo(t)
			if tt.setupMocks != nil {
				tt.setupMocks(mockRepo)
			}
			svc := NewUserService(mockRepo)

			// 2. Execute target method using t.Context() (Go 1.24+)
			gotID, err := svc.Register(t.Context(), tt.args.email, tt.args.password)

			// 3. Verify error using require.ErrorIs (never string matching)
			if tt.wantErr != nil {
				require.ErrorIs(t, err, tt.wantErr)
				assert.Empty(t, gotID)
				return
			}
			require.NoError(t, err)

			// 4. Verify return values
			assert.Equal(t, tt.wantUserID, gotID)
		})
	}
}
```

---

## 2. Assertion Rules: `assert` vs `require`

When using `stretchr/testify`, strictly distinguish their intended use cases:
- **`require.*`**: For preconditions. When an assertion fails, it immediately terminates the current test via `t.FailNow()`, preventing nil-pointer dereference panics (e.g., `require.NoError(t, err)`, `require.NotNil(t, result)`).
- **`assert.*`**: For comparing results. A failure marks the test as failed but allows execution to proceed, collecting all assertion failure messages in a single run (e.g., `assert.Equal(t, want, got)`).

---

## 3. Mocking Principles & Interface Design

1. **Don't Mock What You Don't Own**:
   - Never mock standard library types (e.g., `http.Client`) or third-party concrete structs directly. Define your own application adapter interface (e.g., `PaymentGateway`), and mock only that interface.
2. **Consumer-Driven Interfaces**:
   ```go
   // ❌ Bad: Monolithic 20-method interface declared in the persistence package
   package postgres
   type GlobalUserStore interface { ... }

   // ✅ Good: Service declares only the 1-2 methods it actually requires
   package service
   type UserFinder interface {
       FindByID(ctx context.Context, id string) (*User, error)
   }
   ```
3. **Prefer In-Memory Fakes Over Heavy Mock Boilerplate**:
   - For simple storage state, prefer lightweight fakes (backed by a slice or `sync.Map`), significantly reducing verbose mock expectations.

---

## 4. Concurrency & Time Testing (`synctest`)

Never use arbitrary `time.Sleep` in tests to wait for goroutines or timeouts — it leads to flaky and slow test suites.
- In Go 1.25+, use **`testing/synctest`** (the synthetic time and goroutine bubble) to test concurrent and time-dependent logic deterministically:

```go
func TestRateLimiter(t *testing.T) {
	synctest.Test(t, func(t *testing.T) {
		limiter := NewRateLimiter(100 * time.Millisecond)
		require.True(t, limiter.Allow())
		require.False(t, limiter.Allow())

		// Fast-forward fake synthetic time without blocking real execution
		time.Sleep(100 * time.Millisecond)
		synctest.Wait() // Wait for bubbled goroutines to reach durable blocks
		assert.True(t, limiter.Allow())
	})
}
```

---

## 5. Modern Benchmarks (`b.Loop()`)

In Go 1.24+, use `for b.Loop()` instead of `for i := 0; i < b.N; i++`. It automatically handles timer resetting and loop setup:

```go
func BenchmarkHashToken(b *testing.B) {
	token := []byte("example-token-payload")
	b.ResetTimer()
	for b.Loop() {
		_ = HashToken(token)
	}
}
```

---

## 6. Fuzzing (`testing.F`)

Any function performing data serialization/deserialization, parsing, hashing/crypto, or custom protocol decoding must include fuzz testing:

```go
func FuzzParseJSONConfig(f *testing.F) {
	// 1. Add seed corpus
	f.Add([]byte(`{"host":"localhost","port":8080}`))
	f.Add([]byte(`{}`))
	f.Add([]byte(`invalid json`))

	f.Fuzz(func(t *testing.T, data []byte) {
		cfg, err := ParseConfig(data)
		if err != nil {
			// Returning an error is expected; it must NEVER panic
			return
		}
		// If parsing succeeds, the struct must be in a valid state
		if cfg == nil {
			t.Errorf("expected non-nil config when err is nil")
		}
	})
}
```

---

## 7. Quality Gates & Verification Pipeline

Always execute the verification pipeline in order before committing or creating a pull request (`go fix` runs before formatting so modernizers are applied prior to formatting):

```bash
# 1. Tidy dependencies and verify module hashes
go mod tidy
go mod verify

# 2. Modernize code idioms and APIs (Go 1.26+ modernizers)
go fix ./...

# 3. Format code with standard formatters
golangci-lint run --fix # or: go fmt ./...

# 4. Static analysis checks (misused printf, copied locks, etc.)
go vet ./...

# 5. Run linters in parallel
golangci-lint run --timeout=5m

# 6. Concurrency data race detection with shuffled execution order and atomic coverage
go test -race -shuffle=on -coverprofile=coverage.out -covermode=atomic ./...
go tool cover -func=coverage.out | grep total

# 7. Scan for reachable known vulnerabilities
govulncheck ./...
```
