# Testing & Quality Gates Specification

---

## 1. Table-Driven Tests Standard

All functions containing branching or business logic must use **Table-Driven Tests**.

### Standard Test Template
```go
package service_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUserService_Register(t *testing.T) {
	t.Parallel() // Enable parallel test execution

	// Define input arguments and expectations
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
		checkErr   func(t *testing.T, err error) // For dynamic error verification
	}{
		{
			name: "successful registration",
			args: args{
				email:    "user@example.com",
				password: "SecurePassword123!",
			},
			setupMocks: func(m *MockUserRepo) {
				m.EXPECT().
					FindByEmail(context.Background(), "user@example.com").
					Return(nil, ErrUserNotFound)
				m.EXPECT().
					Create(context.Background(), mock.Anything).
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
					FindByEmail(context.Background(), "existing@example.com").
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

			// 2. Execute target method
			gotID, err := svc.Register(context.Background(), tt.args.email, tt.args.password)

			// 3. Verify error
			if tt.wantErr != nil {
				require.Error(t, err)
				assert.ErrorIs(t, err, tt.wantErr)
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

## 4. Fuzzing (`testing.F`)

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

## 5. Quality Gates & Verification Commands

Before creating a commit or submitting a PR, verify against all 4 quality gates:

```bash
# 1. Concurrency data race detection (Mandatory core check)
go test -race -timeout 60s ./...

# 2. Run unit tests and calculate atomic test coverage
go test -coverprofile=coverage.out -covermode=atomic ./...
go tool cover -func=coverage.out | grep total

# 3. Run static analysis linters
golangci-lint run --timeout=5m

# 4. Verify module hygiene and integrity
go mod tidy
go mod verify
```
