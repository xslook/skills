package example_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Example domain types and errors under test
var ErrNotFound = errors.New("record not found")

type User struct {
	ID    string
	Email string
}

type UserRepository interface {
	FindByID(ctx context.Context, id string) (*User, error)
}

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
	if id == "" {
		return nil, errors.New("empty user id")
	}
	return s.repo.FindByID(ctx, id)
}

// In-memory fake implementation (or generated using mockgen / testify/mock)
type fakeUserRepo struct {
	findFn func(ctx context.Context, id string) (*User, error)
}

func (f *fakeUserRepo) FindByID(ctx context.Context, id string) (*User, error) {
	return f.findFn(ctx, id)
}

// Standard table-driven unit test
func TestUserService_GetUser(t *testing.T) {
	t.Parallel()

	type fields struct {
		findFn func(ctx context.Context, id string) (*User, error)
	}
	type args struct {
		ctx context.Context
		id  string
	}

	tests := []struct {
		name     string
		fields   fields
		args     args
		wantUser *User
		wantErr  error
		checkErr func(t *testing.T, err error)
	}{
		{
			name: "successfully query existing user",
			fields: fields{
				findFn: func(ctx context.Context, id string) (*User, error) {
					return &User{ID: "u-123", Email: "test@example.com"}, nil
				},
			},
			args: args{
				ctx: context.Background(),
				id:  "u-123",
			},
			wantUser: &User{ID: "u-123", Email: "test@example.com"},
			wantErr:  nil,
		},
		{
			name: "error on empty user id",
			fields: fields{
				findFn: nil, // Should not invoke repo
			},
			args: args{
				ctx: context.Background(),
				id:  "",
			},
			wantUser: nil,
			checkErr: func(t *testing.T, err error) {
				require.Error(t, err)
				assert.Contains(t, err.Error(), "empty user id")
			},
		},
		{
			name: "return ErrNotFound when user does not exist",
			fields: fields{
				findFn: func(ctx context.Context, id string) (*User, error) {
					return nil, ErrNotFound
				},
			},
			args: args{
				ctx: context.Background(),
				id:  "u-404",
			},
			wantUser: nil,
			wantErr:  ErrNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			repo := &fakeUserRepo{findFn: tt.fields.findFn}
			svc := NewUserService(repo)

			got, err := svc.GetUser(tt.args.ctx, tt.args.id)

			if tt.wantErr != nil {
				require.Error(t, err)
				assert.ErrorIs(t, err, tt.wantErr)
				assert.Nil(t, got)
				return
			}

			if tt.checkErr != nil {
				tt.checkErr(t, err)
				assert.Nil(t, got)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.wantUser, got)
		})
	}
}
