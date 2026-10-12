---
name: go-spec
description: Use when designing, scaffolding, developing, refactoring, testing, or reviewing Go (Golang) applications, services, CLI tools, libraries, or modules (.go, go.mod, goroutines, slog, net/http).
---

# Go Engineering Specification

Enforces production-grade Go engineering standards to guarantee clean architecture (CLI to DDD), explicit error wrapping, leak-free concurrency, structured `slog` logging, deterministic table-driven testing, and modern single-binary web delivery.

---

## 1. Non-Negotiable Golden Rules

0. **Inspect Go Baseline First**:
   - Check the `go` directive in `go.mod` before writing code. Never generate APIs newer than the project's Go version. Consult [modern_go.md](./references/modern_go.md) for modern equivalents.
1. **Explicit Error Handling & Wrapping**:
   - Never ignore `error` values.
   - Wrap errors with `fmt.Errorf("...: %w", err)`. Inspect error identity with `errors.Is` and extract types with `errors.As` (or `errors.AsType` in Go 1.26+). Never match on error text strings.
   - **Handle errors only once**: Either handle and log locally at system boundaries, or wrap and return up the stack. Never log and return simultaneously.
2. **Context Propagation**:
   - Any function involving I/O, database queries, RPC, network calls, or cancellations must accept `ctx context.Context` as its first parameter.
   - Never store a `context.Context` inside a struct field.
3. **No Leaking Goroutines (Lifecycle Closure)**:
   - Never launch unmanaged goroutines. Every background goroutine must have an owner that tracks its completion (`sync.WaitGroup`, `golang.org/x/sync/errgroup`) and a way to stop it (`<-ctx.Done()`).
4. **Accept Interfaces, Return Structs**:
   - Define interfaces on the **consumer** side, keeping them minimal (1–2 methods).
   - Accept interfaces in parameters; return concrete structs. Avoid defining monolithic interfaces in producer packages. *(Note: In Clean/Hexagonal/DDD architecture, domain ports are defined by the domain consumer).*
5. **Consistency First in Brownfield Projects**:
   - When modifying existing codebases, detect and match existing conventions (logging library, error handling, layering, naming, testing). Never introduce conflicting secondary standards into an established project.
6. **No Logger Passing (Use Global `slog` Directly)**:
   - Don't pass a logger pointer (e.g., `*slog.Logger`) as a function/method argument or struct field in your own packages.
   - Use package-level global `slog` methods directly (e.g., `slog.InfoContext(ctx, ...)`, `slog.ErrorContext(ctx, ...)`). Configure handlers once at startup via `slog.SetDefault()`.
   - *(Exception: If a third-party library requires passing a logger pointer in its struct/config, follow the library's API).*
7. **Strict GoDoc Comments**:
   - All exported packages, types, functions, methods, constants, and variables must have complete-sentence GoDoc comments starting with the identifier's name.
   - Critical and core functions must provide usage examples in their doc comments.
   - Code comments must document intent, concurrency invariants, or trade-offs—never redundantly restate syntax.

### Optional Standards (Web Applications)

- **Modern Vanilla Web & Single Binary Delivery**:
  - Build Web UIs using native modern standards (Vanilla JS/CSS/HTML5) and Go `html/template` styled with pure CSS tokens (shadcn-compatible), without Node.js/Webpack build pipelines.
  - Bundle templates and static assets into the binary using `//go:embed`. Clone layout templates per page to prevent template block collisions.
  - Protect mutating endpoints using `http.CrossOriginProtection` (Go 1.25+) or CSRF tokens, secure session cookies (`__Host-` prefix, `HttpOnly`, `Secure`, `SameSite=Lax`), and strict CSP nonces.

---

## 2. Scale & Architecture Decision Matrix

| Scale | Criteria | Target Architecture | Primary Layout | Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Small** | < 1,000 LoC / Single focus | Minimal Root Layout | Root `main.go` + private `internal/` packages | [scale_and_structures.md](./references/scale_and_structures.md#2-small-project-specification-root-main--internal-layout) |
| **Medium** | 1,000–15,000 LoC / Standalone API | Standard Go Layout | `cmd/<app>/main.go`, `internal/` (app/service/repo), `pkg/` | [scale_and_structures.md](./references/scale_and_structures.md#3-medium-project-specification-standard-go-project-layout) |
| **Large** | > 15,000 LoC / Multi-domain DDD | Clean / Hexagonal | `internal/domain`, `internal/usecase`, `internal/adapter` | [scale_and_structures.md](./references/scale_and_structures.md#4-large-project-specification-clean--hexagonal--ddd-architecture) |

For multi-service monorepos, configure Go Workspaces via `go.work`.

---

## 3. References Index

| Topic | Reference Document | Description & Key Patterns |
| :--- | :--- | :--- |
| **Modern Go & Anti-Patterns** | [modern_go.md](./references/modern_go.md) | Outdated vs modern Go idioms (Go 1.21–1.26+), `wg.Go`, `synctest`, `errors.AsType`, generics guide |
| **Scale & Project Layouts** | [scale_and_structures.md](./references/scale_and_structures.md) | Small CLI, Standard Service, Clean Architecture/DDD directory trees, `go.work` |
| **Greenfield & Brownfield SOP** | [greenfield_and_brownfield.md](./references/greenfield_and_brownfield.md) | Go version inspection, bottom-up scaffolding pipeline, graceful shutdown skeleton |
| **Logging & Observability** | [logging_and_observability.md](./references/logging_and_observability.md) | `log/slog` TraceID handler, RED metrics with `r.Pattern`, health probes with draining |
| **Testing & Quality Gates** | [testing_and_quality.md](./references/testing_and_quality.md) | Table-driven testing skeleton, `t.Context()`, `synctest`, `b.Loop()`, interface mocking, fuzz testing |
| **Error Handling & Concurrency** | [errors_and_concurrency.md](./references/errors_and_concurrency.md) | `%w` wrapping, `errors.AsType`, `errgroup` bounded parallelism, worker panic isolation |
| **Idiomatic Go & Pitfalls** | [idiomatic_go_best_practices.md](./references/idiomatic_go_best_practices.md) | Consumer interfaces, resource leak fixes (SQL rows/tx, HTTP body, loop defer), `os.Root` sandbox |
| **Web UI & Security** | [web_ui_and_templating.md](./references/web_ui_and_templating.md) | `//go:embed` cloned page templates, shadcn CSS tokens, `http.CrossOriginProtection`, CSP nonces |
| **Code Comments & Documentation** | [documentation_and_comments.md](./references/documentation_and_comments.md) | Exported identifier comments, code block intent documentation, `Deprecated:`, `TODO` |

---

## 4. Templates & Configurations

- **Linter Config**: [golangci.yml](./templates/golangci.yml) (Production golangci-lint v2 configuration with `errorlint`, `sloglint`, `noctx`, `bodyclose`, `modernize`, `revive`)
- **Build Makefile**: [Makefile](./templates/Makefile) (Standard targets for `tidy`, `fix`, `fmt`, `vet`, `lint`, `test`, `race`, `vuln`, `build`)
- **Table Test Template**: [standard_table_test.go](./templates/standard_table_test.go) (Parallel table-driven test skeleton with `t.Context()` and sentinel error matching)
- **Web UI Templates**:
  - [shadcn_tokens.css](./templates/web/shadcn_tokens.css) (Zero-dependency pure modern CSS design system matching shadcn/ui)
  - [base_layout.html](./templates/web/base_layout.html) (Responsive HTML5 layout with Go `html/template`, CSP nonce, dark mode, and unified Fetch client)
  - [embed_server.go](./templates/web/embed_server.go) (Single-binary Web server skeleton with cloned templates, `http.CrossOriginProtection`, and graceful shutdown)

---

## 5. Automated Quality Gates (CI / Pre-Commit)

Execute the verification pipeline in order. All checks must pass with zero warnings, zero data races, and zero reachable vulnerabilities:

```bash
# 1. Clean unused dependencies and verify cryptographic module hashes
go mod tidy
go mod verify

# 2. Modernize code idioms and APIs (Go 1.26+ modernizers; run before formatting)
go fix ./...

# 3. Format code with standard formatters (gofumpt + goimports via golangci-lint)
golangci-lint fmt # or: go fmt ./...

# 4. Catch suspicious constructs (printf, copied locks, unreachable code)
go vet ./...

# 5. Run static analysis linters
golangci-lint run

# 6. Run tests with race detection, shuffled execution, and atomic coverage
go test -race -shuffle=on -coverprofile=coverage.out -covermode=atomic ./...

# 7. Scan for known reachable vulnerabilities
govulncheck ./... # or: go tool govulncheck ./...
```

---

## 6. Pre-Delivery Code Quality Checklist

Verify code adherence to non-negotiable architectural and design standards before submitting:

- [ ] **Go Baseline**: Verified `go` version in `go.mod` and used only compatible standard library features.
- [ ] **Modern Idioms**: Applied modern Go standards (`any`, `min`/`max`, `slices`/`maps`, `wg.Go`, `t.Context()`) per [modern_go.md](./references/modern_go.md).
- [ ] **Explicit Errors**: All errors are wrapped with `%w` or handled at boundaries; no "log and return" anti-pattern; no error text string matching.
- [ ] **Context Propagation**: `ctx context.Context` is the first parameter for all I/O, database, and network operations; never stored in struct fields.
- [ ] **Goroutine Closure**: All background goroutines are bounded by `ctx.Done()`, `sync.WaitGroup`, or `errgroup.Group`.
- [ ] **Global Logging**: No logger pointer passed as function argument or struct field; global `slog` methods used directly with context.
- [ ] **GoDoc Coverage**: All exported packages, types, functions, methods, and constants have complete-sentence GoDoc comments starting with their name.
- [ ] **Design Intent**: Non-obvious code blocks (locks, buffered channels, defensive workarounds) document intent and invariants.
- [ ] **Resource Hygiene**: Response bodies drained and closed; SQL rows/transactions closed; HTTP clients configure explicit timeouts.
- [ ] **Web UI (Optional)**: Templates cloned per-page; mutating endpoints protected via `http.CrossOriginProtection`; cookies use `__Host-` prefix with `HttpOnly` and `Secure`; CSP nonces configured.
