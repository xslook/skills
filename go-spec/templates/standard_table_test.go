package example_test

import (
	"context"
	"errors"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// --- Example code under test (normally lives in the non-test package) ---

var (
	// ErrNotFound is returned when the user does not exist.
	ErrNotFound = errors.New("user not found")
	// ErrEmptyID is returned when an empty user ID is supplied.
	ErrEmptyID = errors.New("empty user id")
)

type User struct {
	ID    string
	Email string
}

// UserFinder is the consumer-side interface the service depends on.
type UserFinder interface {
	FindByID(ctx context.Context, id string) (*User, error)
}

type UserService struct {
	repo UserFinder
}

func NewUserService(repo UserFinder) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
	if id == "" {
		return nil, ErrEmptyID
	}
	u, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("find user %s: %w", id, err)
	}
	return u, nil
}

// --- Test doubles ---

// fakeUserFinder is a lightweight function-backed fake. Prefer this over
// generated mocks when the interface is small.
type fakeUserFinder struct {
	findFn func(ctx context.Context, id string) (*User, error)
}

func (f *fakeUserFinder) FindByID(ctx context.Context, id string) (*User, error) {
	if f.findFn == nil {
		return nil, errors.New("fakeUserFinder.FindByID called unexpectedly")
	}
	return f.findFn(ctx, id)
}

// --- Table-driven test ---

func TestUserService_GetUser(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name     string
		id       string
		findFn   func(ctx context.Context, id string) (*User, error)
		wantUser *User
		wantErr  error // Matched with errors.Is; never compare error strings.
	}{
		{
			name: "returns existing user",
			id:   "u-123",
			findFn: func(_ context.Context, id string) (*User, error) {
				return &User{ID: id, Email: "test@example.com"}, nil
			},
			wantUser: &User{ID: "u-123", Email: "test@example.com"},
		},
		{
			name:    "rejects empty id without calling repository",
			id:      "",
			findFn:  nil, // A call would fail via the fake's guard.
			wantErr: ErrEmptyID,
		},
		{
			name: "wraps repository not-found error",
			id:   "u-404",
			findFn: func(context.Context, string) (*User, error) {
				return nil, ErrNotFound
			},
			wantErr: ErrNotFound,
		},
	}

	// Go 1.22+ gives each iteration its own `tt`; no `tt := tt` copy is needed.
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			svc := NewUserService(&fakeUserFinder{findFn: tt.findFn})

			// t.Context() (Go 1.24+) is canceled when the test ends.
			got, err := svc.GetUser(t.Context(), tt.id)

			if tt.wantErr != nil {
				require.ErrorIs(t, err, tt.wantErr)
				assert.Nil(t, got)
				return
			}
			require.NoError(t, err)
			assert.Equal(t, tt.wantUser, got)
		})
	}
}
