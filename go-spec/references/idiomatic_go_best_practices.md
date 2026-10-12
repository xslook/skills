# Idiomatic Go & Pitfall Prevention Specification

---

## 1. Interface Design Standards

### 1.1 "Accept Interfaces, Return Structs"
- **Function Parameters**: Accept the minimal interface required to perform the task (maximizing decoupling and testability).
- **Function Results**: Return concrete struct pointers or values (preserving flexibility without imposing premature abstractions on callers).

```go
// ✅ Good: Accepts minimal interface, returns concrete struct
type Reader interface {
    Read(p []byte) (n int, err error)
}

func ParsePayload(r io.Reader) (*Payload, error) { ... }

// ❌ Bad: Premature abstraction returning a generic interface
func NewUserService() UserServiceInterface { ... }
```

### 1.2 Avoid Interface Pollution
- Do not create an interface for a struct that only has a single concrete implementation in the same package.
- Interfaces should be declared by the **consumer** when mockability, replacement, or decoupling is genuinely required.

### 1.3 Make Zero Values Useful
Design structs so that their zero-value state is safe and ready to use without requiring an explicit initialization routine:
```go
// ✅ Good: Zero value is immediately ready (embedded sync.Mutex, unallocated slice works as empty)
type SafeCounter struct {
    mu    sync.Mutex
    count int
}

func (c *SafeCounter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}
```

---

## 2. Naming & Style Conventions

### 2.1 Acronyms & Initialisms
Go convention requires initialisms and acronyms to maintain consistent casing (all uppercase, or all lowercase if unexported leading):
- **Correct**: `userID`, `appURL`, `httpServer`, `parseJSON`, `xmlReader`, `ipAddress`
- **Incorrect**: `userId`, `appUrl`, `HttpServer`, `parseJson`, `XmlReader`, `IpAddress`

### 2.2 Avoid Stuttering
- **Correct**: `user.Service`, `http.Client`, `config.Loader`, `db.Connection`
- **Incorrect**: `user.UserService`, `http.HttpClient`, `config.ConfigLoader`, `db.DBConnection`

### 2.3 Package Naming
- Package names must be lowercase, singular, concise, and contain no underscores or hyphens.
- Never create catch-all utility packages: `util`, `utils`, `common`, `helper`, `shared`.
  - *Refactoring advice*: Name packages by their specific domain responsibility, e.g., `httpx`, `stringsutil`, `crypto`, `hash`.

---

## 3. Common Resource Leaks & Security Pitfalls

### 3.1 Unclosed or Undrained HTTP Response Bodies & Zero-Timeout Clients
1. **Never use zero-timeout HTTP clients**: `http.DefaultClient` and `http.Client{}` have no timeout. A hanging connection can tie up goroutines and sockets indefinitely.
2. **Always drain and close response bodies**: Even if you don't read the body, drain it to `io.Discard` before closing so TCP connections can be reused.

```go
// ✅ Good: Configured client timeout, proper body draining and closing
client := &http.Client{
    Timeout: 10 * time.Second,
}

resp, err := client.Do(req)
if err != nil {
    return err
}
defer func() {
    _, _ = io.Copy(io.Discard, resp.Body) // Drain body to allow connection reuse
    _ = resp.Body.Close()
}()
```

### 3.2 SQL Resource Management & Transactions
#### Iterating Rows
Always close rows and check `rows.Err()`:
```go
// ✅ Good: Always defer rows.Close() and inspect rows.Err() after iteration
rows, err := db.QueryContext(ctx, "SELECT id, name FROM users WHERE age > $1", age)
if err != nil {
    return err
}
defer func() { _ = rows.Close() }()

for rows.Next() {
    if err := rows.Scan(&id, &name); err != nil {
        return err
    }
}
if err := rows.Err(); err != nil {
    return fmt.Errorf("iterate rows: %w", err)
}
```

#### Safe Transactions with `defer tx.Rollback()`
In Go, `tx.Rollback()` is a safe no-op if `tx.Commit()` has already succeeded. Always defer rollback immediately after starting a transaction:
```go
tx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelReadCommitted})
if err != nil {
    return fmt.Errorf("begin tx: %w", err)
}
defer func() { _ = tx.Rollback() }() // Safe no-op if tx.Commit() succeeds

if err := execStatements(ctx, tx); err != nil {
    return err
}

if err := tx.Commit(); err != nil {
    return fmt.Errorf("commit tx: %w", err)
}
return nil
```

#### Production Connection Pool Tuning
A zero-configured `*sql.DB` defaults to unlimited open connections and 2 idle connections, causing connection thrashing under load:
```go
db.SetMaxOpenConns(25)                  // Bounded total concurrent connections
db.SetMaxIdleConns(25)                  // Match open conns to avoid opening/closing thrash
db.SetConnMaxLifetime(5 * time.Minute)  // Recycle connections before DB kills them
db.SetConnMaxIdleTime(1 * time.Minute)  // Clean up idle connections during low-traffic periods
```

### 3.3 Hanging `defer` in Tight Loops
Calling `defer` inside a long or infinite loop delays resource release until the enclosing outer function exits, rapidly exhausting memory or file descriptors:

```go
// ❌ Bad: Defer in a loop causes file descriptor exhaustion
for _, filename := range files {
    f, _ := os.Open(filename)
    defer f.Close() // Only runs when the outer enclosing function returns!
    process(f)
}

// ✅ Good: Isolate iteration in a dedicated helper that handles errors and deferred cleanup
for _, filename := range files {
    if err := processFile(filename); err != nil {
        slog.Warn("process file failed", slog.String("file", filename), slog.Any("error", err))
        continue
    }
}

func processFile(name string) error {
    f, err := os.Open(name)
    if err != nil {
        return fmt.Errorf("open %s: %w", name, err)
    }
    defer func() { _ = f.Close() }()
    return process(f)
}
```

### 3.4 Subslice Holding Large Underlying Array in Memory
Taking a tiny slice of a massive underlying byte array keeps the entire large array pinned in memory:

```go
// ❌ Bad: 100MB array remains pinned in heap memory just for 10 bytes
func GetHeader(hugeData []byte) []byte {
    return hugeData[:10]
}

// ✅ Good: Copy to an independent slice allowing GC of the original buffer
func GetHeader(hugeData []byte) []byte {
    header := make([]byte, 10)
    copy(header, hugeData[:10])
    return header
}
```

### 3.5 Accidental Mutex Copying
Passing a struct that embeds or contains a `sync.Mutex` by value copies its internal locking state, causing deadlocks or unsynchronized data races:

```go
// ❌ Bad: Value receiver copies the mutex!
func (s SafeCounter) Value() int { // go vet flags this (copylocks)
    s.mu.Lock()
    defer s.mu.Unlock()
    return s.count
}

// ✅ Good: Pointer receiver ensures all callers access the same lock instance
func (s *SafeCounter) Value() int {
    s.mu.Lock()
    defer s.mu.Unlock()
    return s.count
}
```

### 3.6 Directory Sandboxing & Path Traversal Prevention (`os.Root`)
In Go 1.24+, never join untrusted user-supplied file paths with `filepath.Join` to access files in a directory, as `../` attacks can traverse out. Use **`os.Root`** to guarantee confinement:

```go
// ✅ Go 1.24+: os.Root confines all operations inside the directory
root, err := os.OpenRoot("/var/app/data")
if err != nil {
    return err
}
defer func() { _ = root.Close() }()

// Opens user-requested path strictly within /var/app/data; rejects any path traversal escaping root
f, err := root.Open(userInputFilename)
if err != nil {
    return fmt.Errorf("open confined file: %w", err)
}
defer func() { _ = f.Close() }()
```

---

## 4. Dependency Injection: Manual Constructor Wiring
Use **explicit constructor injection (Manual DI)**:

```go
package app

type App struct {
    userHandler  *handler.UserHandler
    orderHandler *handler.OrderHandler
}

func NewApp(db *sql.DB, rdb *redis.Client) *App {
    // 1. Initialize repositories
    userRepo := repository.NewUserPostgres(db)
    orderRepo := repository.NewOrderPostgres(db)

    // 2. Initialize application services (use global slog directly inside services)
    userService := service.NewUserService(userRepo)
    orderService := service.NewOrderService(orderRepo, userRepo)

    // 3. Initialize transport handlers
    userHandler := handler.NewUserHandler(userService)
    orderHandler := handler.NewOrderHandler(orderService)

    return &App{
        userHandler:  userHandler,
        orderHandler: orderHandler,
    }
}
```

---

## 5. Logging Standards & Pitfalls: Global `slog` vs Passing Logger Pointers

### 5.1 Anti-Pattern: Passing Logger Pointers as Function Arguments
**DO NOT pass a logger pointer (`*slog.Logger`) as a function argument or store it in struct fields—it is a bad practice!**

```go
// ❌ Bad: Passing logger pointer as function/method parameter or struct field
type UserService struct {
    repo   UserRepository
    logger *slog.Logger // Struct bloat
}

func NewUserService(repo UserRepository, logger *slog.Logger) *UserService {
    return &UserService{repo: repo, logger: logger}
}

func (s *UserService) UpdateUser(ctx context.Context, logger *slog.Logger, id string) error {
    logger.InfoContext(ctx, "updating user", "id", id) // Clutters function signature
    return nil
}
```

#### Why Passing Logger Pointers is a Bad Practice
1. **Signature Pollution**: Method and function signatures become cluttered with non-domain concerns (`func DoWork(ctx context.Context, logger *slog.Logger, ...)`), reducing readability.
2. **Struct Bloat**: Every service, repository, and controller carries a redundant `logger *slog.Logger` field that must be passed through every constructor.
3. **Redundant with `context.Context`**: Go's `log/slog` already provides package-level context-aware functions (`slog.InfoContext`, `slog.ErrorContext`) that extract trace IDs, request IDs, and request metadata directly from `ctx`.
4. **Maintenance Friction**: Changing logging requirements forces cascading signature refactors across calling stacks.

### 5.2 Idiomatic Pattern: Use Package-Level Global `slog` Directly
Configure the default logger once at application startup (in `main.go`), and call package-level global `slog` functions directly in your packages:

```go
// ✅ Good: No logger in struct or method signatures
type UserService struct {
    repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}

func (s *UserService) UpdateUser(ctx context.Context, id string) error {
    // Call package-level slog functions directly with context
    slog.InfoContext(ctx, "updating user", "id", id)
    return nil
}
```

### 5.3 Attribute Formatting: Strongly-Typed & Key-Value Pairs
Both strongly-typed `slog.Attr` and loosely-typed key-value pairs are valid:
```go
// Strongly-typed (type-safe, slightly more performant):
slog.InfoContext(ctx, "task processed",
    slog.String("task_id", id),
    slog.Int("retries", retries),
)

// Loosely-typed key-value pairs (idiomatic, concise):
slog.InfoContext(ctx, "task processed", "task_id", id, "retries", retries)
```

### 5.4 Third-Party Library Exception
If an external third-party library explicitly requires a `*slog.Logger` in its configuration struct or constructor (e.g., an HTTP framework or driver adapter), pass it to satisfy the library's API. Never adopt this pattern in your own packages or application code.
