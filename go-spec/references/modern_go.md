# Modern Go Idioms & LLM Anti-Pattern Prevention Guide

Because large language models were pre-trained on vast amounts of legacy Go code (pre-Go 1.21), they frequently default to deprecated packages, obsolete idioms, and unnecessary boilerplate.

Use this guide to modernize Go code and eliminate legacy patterns. Before applying version-gated idioms, check the `go` directive in `go.mod`.

---

## 1. Quick Reference: Outdated vs Modern Idioms

| Legacy / Outdated Pattern ❌ | Modern Idiom ✅ | Go Version | Notes & Rationale |
| :--- | :--- | :--- | :--- |
| `interface{}` | `any` | 1.18+ | Built-in alias, clearer intent, less punctuation noise. |
| `ioutil.ReadFile`, `ioutil.ReadAll` | `os.ReadFile`, `io.ReadAll` | 1.16+ | `io/ioutil` is deprecated. Use `os` and `io`. |
| `sort.Slice(s, func(i, j int) bool ...)` | `slices.SortFunc(s, func(a, b T) int ...)` | 1.21+ | Type-safe, avoids reflection and slice index swapping. |
| `slices.Index`, custom contains loop | `slices.Contains(s, target)` | 1.21+ | Native helper in standard library `slices` package. |
| Custom min/max or `math.Min(float64(a)...)` | `min(a, b)`, `max(a, b)` | 1.21+ | Built-in functions work directly on any comparable numbers. |
| `sync.Once` + separate package variable | `sync.OnceValue(fn)` / `sync.OnceValues(fn)` | 1.21+ | Clean lazy evaluation returning values and errors without boilerplate. |
| Manual context detach goroutines | `context.WithoutCancel(ctx)` | 1.21+ | Preserves trace/request IDs while ignoring cancellation for background tasks. |
| Polling `<-ctx.Done()` in worker cleanup | `stop := context.AfterFunc(ctx, fn)` | 1.21+ | Runs callback on context cancellation without dedicated goroutine. |
| `tt := tt` inside table-driven tests | *(Delete the line completely)* | 1.22+ | Loop variables are per-iteration scoped; copying is obsolete. |
| `for i := 0; i < n; i++` | `for i := range n` (or `for range n`) | 1.22+ | Clean integer range loop syntax. |
| Third-party chi/mux for simple routing | `mux.HandleFunc("GET /users/{id}", ...)` | 1.22+ | Native `net/http.ServeMux` supports HTTP methods and wildcards. |
| `context.Background()` in unit tests | `t.Context()` | 1.24+ | Context is automatically canceled when test completes. |
| `for i := 0; i < b.N; i++` in benchmarks | `for b.Loop()` | 1.24+ | Automatically resets timer and handles loop iteration. |
| `// +build tools` in `tools.go` | `go get -tool <pkg>` & `go tool <pkg>` | 1.24+ | Modules natively pin tool dependencies in `go.mod`. |
| Hand-rolled slice chunking arithmetic loops | `for chunk := range slices.Chunk(s, n)` | 1.23+ | Native iterator, eliminates slice index out-of-bounds bugs. |
| Custom generator channels / slice collectors | `iter.Seq[V]`, `slices.Collect(seq)` | 1.23+ | Standardized iterators; prevents leaky goroutines in generators. |
| `filepath.Join(dir, untrusted)` | `root.Open(untrusted)` with `os.Root` | 1.24+ | Sandboxes filesystem access; prevents `../` path traversal attacks. |
| `rand.Seed(time.Now().UnixNano())` | *(Delete the line completely)* | 1.20+ | Global math/rand is auto-seeded. |
| `rand.Read` + hex for random tokens | `rand.Text()` from `crypto/rand` | 1.24+ | Returns cryptographically secure random base32 string directly. |
| `json:",omitempty"` on zero structs/time | `json:",omitzero"` | 1.24+ | Omits struct or time.Time values when they match their zero value. |
| `wg.Add(1); go func(){ defer wg.Done() ... }` | `wg.Go(func() { ... })` | 1.25+ | `sync.WaitGroup` manages counter lifecycle automatically. |
| Hand-rolled CSRF cookies & hidden forms | `http.NewCrossOriginProtection()` | 1.25+ | Zero-token browser Sec-Fetch-Site / Origin enforcement in stdlib. |
| `time.Sleep(...)` to test concurrency | `testing/synctest.Test(t, func(t *testing.T) { ... })` | 1.25+ | Synthetic time bubble: fast, zero sleep time, non-flaky. |
| `var target *T; errors.As(err, &target)` | `target, ok := errors.AsType[*T](err)` | 1.26+ | Generic, eliminates untyped pointer-to-pointer target bug. |

---

## 2. In-Depth Modern Patterns

### 2.1 Lazy Initialization with `sync.OnceValue` (Go 1.21+)
```go
// ❌ Legacy Pattern (pre-1.21): Verbose and prone to uninitialized reads
var (
    cachedConfig *Config
    configOnce   sync.Once
)

func GetConfig() *Config {
    configOnce.Do(func() {
        cachedConfig = loadConfig()
    })
    return cachedConfig
}

// ✅ Modern Pattern (Go 1.21+): Clean closure returning typed value
var getConfig = sync.OnceValue(func() *Config {
    return loadConfig()
})

func GetConfig() *Config {
    return getConfig()
}
```

### 2.2 Preserving Values Across Request Lifecycles (`context.WithoutCancel`)
When an HTTP handler finishes or clients disconnect, the request context is canceled. For fire-and-forget background operations that need to preserve trace IDs, do not create an empty `context.Background()`:

```go
// ✅ Good: Preserves logging and tracing attributes from ctx, but detaches timeout/cancel
func logAuditAsync(ctx context.Context, action string) {
    detachedCtx := context.WithoutCancel(ctx)
    go func() {
        // Runs cleanly even if the incoming HTTP request completed
        slog.InfoContext(detachedCtx, "audit record", slog.String("action", action))
    }()
}
```

### 2.3 `sync.WaitGroup.Go` (Go 1.25+)
```go
// ✅ Go 1.25+: Eliminates mismatched Add/Done mistakes
var wg sync.WaitGroup
for _, job := range jobs {
    wg.Go(func() {
        process(job)
    })
}
wg.Wait()
```

### 2.4 Deterministic Concurrency Testing (`testing/synctest`) (Go 1.25+)
```go
// ✅ Go 1.25+: Fast and deterministic synthetic time bubble
func TestDebouncer(t *testing.T) {
    synctest.Test(t, func(t *testing.T) {
        var called atomic.Bool
        debounced := NewDebouncer(500*time.Millisecond, func() {
            called.Store(true)
        })

        debounced.Trigger()
        synctest.Wait() // Wait for internal goroutines to reach durable blocks
        require.False(t, called.Load())

        // Advances synthetic time bubble without sleeping real wall-clock time
        time.Sleep(500 * time.Millisecond)
        synctest.Wait()
        assert.True(t, called.Load())
    })
}
```

### 2.5 Type-Safe Error Extraction with `errors.AsType` (Go 1.26+)
```go
// ❌ Legacy Pattern: Requires pre-allocating variable and passing pointer
var notFoundErr *NotFoundError
if errors.As(err, &notFoundErr) {
    handleNotFound(notFoundErr)
}

// ✅ Modern Pattern (Go 1.26+): Direct generic extraction
if notFoundErr, ok := errors.AsType[*NotFoundError](err); ok {
    handleNotFound(notFoundErr)
}
```

### 2.6 Iterators & Safe Slice Chunking (Go 1.23+)
```go
// ✅ Go 1.23+: Process items in batches without risky manual slice indexing
func ProcessBatches(ctx context.Context, items []string, batchSize int) error {
    for batch := range slices.Chunk(items, batchSize) {
        if err := sendBatch(ctx, batch); err != nil {
            return fmt.Errorf("send batch: %w", err)
        }
    }
    return nil
}
```

---

## 3. Generics: When to Use & When to Avoid

### When Generics Are Idiomatic ✅
1. **Generic Data Structures**: Trees, linked lists, caches, circular buffers, concurrent safe maps (`SafeMap[K comparable, V any]`).
2. **Slice / Map / Set Utility Functions**: Operating on elements without knowing their concrete business type (`slices.Compact`, `maps.Keys`, `Filter[T any](s []T, keep func(T) bool) []T`).
3. **Domain-Agnostic Infrastructure Helpers**: Result types, Paginated response wrappers (`Page[T any]{ Items []T, Total int }`), or generic repositories where schema-mapping logic is identical.

### When Generics Are an Anti-Pattern ❌
1. **Over-abstracting Business Services**: Avoid creating `Service[T DomainEntity]`. Concrete business operations differ in business invariants, validation rules, and lifecycle.
2. **Replacing Interfaces with Type Constraints**: Do not use `[T Reader]` when `io.Reader` suffices. Generics parameterize data types; interfaces parameterize behaviors.
3. **Generic Handlers / Controllers**: Do not write `GenericHTTPHandler[Req, Resp]`. It generates rigid reflection-like glue code and destroys clear HTTP endpoint definitions.
