# 06. Idiomatic Go & Pitfall Prevention Specification

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

## 3. Common Memory & Resource Leaks

### 3.1 Unclosed or Undrained HTTP Response Bodies
```go
// ✅ Good: Always drain and close response bodies to reuse TCP connections
resp, err := client.Do(req)
if err != nil {
    return err
}
defer func() {
    io.Copy(io.Discard, resp.Body) // Drain body to allow connection reuse in HTTP keep-alive pool
    resp.Body.Close()
}()
```

### 3.2 Unclosed SQL Rows
```go
// ✅ Good: Always defer rows.Close() and inspect rows.Err() after iteration
rows, err := db.QueryContext(ctx, "SELECT id, name FROM users WHERE age > $1", age)
if err != nil {
    return err
}
defer rows.Close()

for rows.Next() {
    if err := rows.Scan(&id, &name); err != nil {
        return err
    }
}
if err := rows.Err(); err != nil {
    return fmt.Errorf("iterate rows: %w", err)
}
```

### 3.3 Hanging `defer` in Tight Loops
Calling `defer` inside a long or infinite loop delays resource release until the enclosing outer function exits, rapidly exhausting memory or file descriptors:

```go
// ❌ Bad: Defer in a loop causes file descriptor / memory exhaustion
for _, filename := range files {
    f, _ := os.Open(filename)
    defer f.Close() // Only runs when the outer enclosing function returns!
    process(f)
}

// ✅ Good: Bound defer lifecycle within an anonymous function
for _, filename := range files {
    func(name string) {
        f, err := os.Open(name)
        if err != nil {
            return
        }
        defer f.Close() // Releases immediately upon loop iteration completion
        process(f)
    }(filename)
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

---

## 4. Dependency Injection: Manual Constructor Wiring
Use **explicit constructor injection (Manual DI)**:

```go
package app

type App struct {
    userHandler  *handler.UserHandler
    orderHandler *handler.OrderHandler
}

func NewApp(db *sql.DB, rdb *redis.Client, logger *slog.Logger) *App {
    // 1. Initialize repositories
    userRepo := repository.NewUserPostgres(db)
    orderRepo := repository.NewOrderPostgres(db)

    // 2. Initialize application services
    userService := service.NewUserService(userRepo, logger)
    orderService := service.NewOrderService(orderRepo, userRepo, logger)

    // 3. Initialize transport handlers
    userHandler := handler.NewUserHandler(userService)
    orderHandler := handler.NewOrderHandler(orderService)

    return &App{
        userHandler:  userHandler,
        orderHandler: orderHandler,
    }
}
```
