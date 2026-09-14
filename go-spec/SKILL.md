---
name: go-spec
description: Use when designing, scaffolding, developing, refactoring, testing, or reviewing Go applications.
---

# Go Engineering Specification

Enforces production-grade Go engineering standards to guarantee clean architecture (CLI to DDD), explicit error wrapping, leak-free concurrency, structured slog logging, table-driven testing, and secure single-binary web UI delivery.

---

## 1. Non-Negotiable Golden Rules

1. **Explicit Error Handling & Wrapping**:
   - Never ignore `error` values.
   - Wrap errors with `fmt.Errorf("...: %w", err)`. Inspect error identity with `errors.Is` and extract types with `errors.As`. Never match on error text.
   - **Handle errors only once**: Either handle and log locally, or wrap and return up the stack. Never log and return simultaneously.
2. **Context Propagation**:
   - Any function involving I/O, database queries, RPC, network calls, or cancellations must accept `ctx context.Context` as its first parameter.
   - Never store a `context.Context` inside a struct field.
3. **No Leaking Goroutines (Lifecycle Closure)**:
   - Never launch unmanaged goroutines. Every background goroutine must be bound to `context.Done()`, `sync.WaitGroup`, or `golang.org/x/sync/errgroup`.
4. **Accept Interfaces, Return Structs**:
   - Define interfaces on the **consumer** side, keeping them minimal (1–2 methods).
   - Accept interfaces in parameters; return concrete structs. Avoid defining monolithic interfaces in producer packages.
5. **Consistency First in Brownfield Projects**:
   - When modifying existing codebases, detect and match existing conventions (logging library, error handling, layering, naming, testing). Never introduce conflicting secondary standards into an established project.
6. **Modern Vanilla Web & Single Binary Delivery**:
   - Build Web UIs using native standards (Vanilla JS/CSS/HTML5) and Go `html/template` styled with pure CSS tokens (shadcn-compatible), without Node.js/Webpack build pipelines.
   - Bundle templates and static assets into the binary using `//go:embed`.
   - Enforce CSRF protection on mutating requests, secure session cookies (`HttpOnly`, `Secure`, `SameSite=Lax`), and security headers.
7. **Strict GoDoc Comments**:
   - All exported packages, types, functions, methods, constants, and variables must have complete-sentence GoDoc comments starting with the identifier's name.
   - Critical and core functions must provide usage examples in their doc comments.
   - Code comments must document intent, concurrency invariants, or trade-offs—never redundantly restate syntax.

---

## 2. Scale & Architecture Decision Matrix

| Scale | Criteria | Target Architecture | Primary Layout | Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Small** | < 1,000 LoC / Single focus | Minimal Root Layout | Root `main.go` + private `internal/` packages | [01_scale_and_structures.md](./references/01_scale_and_structures.md#2-small-project-specification-root-main--internal-layout) |
| **Medium** | 1,000–15,000 LoC / Standalone API | Standard Go Layout | `cmd/<app>/main.go`, `internal/` (app/service/repo), `pkg/` | [01_scale_and_structures.md](./references/01_scale_and_structures.md#3-medium-project-specification-standard-go-project-layout) |
| **Large** | > 15,000 LoC / Multi-domain DDD | Clean / Hexagonal | `internal/domain`, `internal/usecase`, `internal/adapter` | [01_scale_and_structures.md](./references/01_scale_and_structures.md#4-large-project-specification-clean--hexagonal--ddd-architecture) |

For multi-service monorepos, configure Go Workspaces via `go.work`.

---

## 3. References Index

| Topic | Reference Document | Description & Key Patterns |
| :--- | :--- | :--- |
| **01. Scale & Project Layouts** | [01_scale_and_structures.md](./references/01_scale_and_structures.md) | Small CLI, Standard Service, Clean Architecture/DDD directory trees, `go.work` |
| **02. Greenfield & Brownfield SOP** | [02_greenfield_and_brownfield.md](./references/02_greenfield_and_brownfield.md) | Bottom-up scaffolding pipeline, graceful shutdown skeleton, backward compatibility options |
| **03. Logging & Observability** | [03_logging_and_observability.md](./references/03_logging_and_observability.md) | `log/slog` TraceID handler, RED metrics middleware, OpenTelemetry spans, health probes |
| **04. Testing & Quality Gates** | [04_testing_and_quality.md](./references/04_testing_and_quality.md) | Table-driven testing skeleton, `require` vs `assert`, interface mocking, fuzz testing |
| **05. Error Handling & Concurrency** | [05_errors_and_concurrency.md](./references/05_errors_and_concurrency.md) | `%w` wrapping, `errors.Is/As`, `AppError`, `errgroup` parallel orchestration, panic recovery |
| **06. Idiomatic Go & Pitfalls** | [06_idiomatic_go_best_practices.md](./references/06_idiomatic_go_best_practices.md#1-interface-design-standards) | Consumer interfaces, resource leak fixes (SQL rows, HTTP body, loop defer), manual DI |
| **07. Web UI & Security** | [07_web_ui_and_templating.md](./references/07_web_ui_and_templating.md) | `//go:embed` asset manager, `html/template` layouts, pure CSS tokens, CSRF & sessions |
| **08. Code Comments & Documentation** | [08_documentation_and_comments.md](./references/08_documentation_and_comments.md) | Exported identifier comments, code block intent documentation, `Deprecated:`, `TODO` |

---

## 4. Templates & Configurations

- **Linter Config**: [golangci.yml](./templates/golangci.yml) (Production configuration with `gofumpt`, `govet`, `revive`, `staticcheck`, `errcheck`)
- **Build Makefile**: [Makefile](./templates/Makefile) (Standard targets for `tidy`, `fmt`, `vet`, `lint`, `test`, `race`, `cover`, `build`)
- **Table Test Template**: [standard_table_test.go](./templates/standard_table_test.go) (Parallel table-driven test skeleton with mock injection and assertions)
- **Web UI Templates**:
  - [shadcn_tokens.css](./templates/web/shadcn_tokens.css) (Zero-dependency pure modern CSS design system matching shadcn/ui)
  - [base_layout.html](./templates/web/base_layout.html) (Responsive HTML5 layout with Go `html/template`, dark mode flash-prevention, and unified Fetch client)
  - [embed_server.go](./templates/web/embed_server.go) (Single-binary Web server skeleton with `embed.FS`, CSRF, sessions, and security headers)

---

## 5. Quality Gates & Verification Commands

```bash
# 1. Tidy and verify module dependencies
go mod tidy
go mod verify

# 2. Run static analysis linters
golangci-lint run

# 3. Run all tests with data race detection
go test -race -timeout 60s ./...

# 4. Generate test coverage report (optional)
go test -coverprofile=coverage.out ./...
go tool cover -func=coverage.out
```

---

## 6. Pre-Commit / Pre-Delivery Checklist

- [ ] Baseline targets Go 1.23+.
- [ ] `go vet ./...` and `golangci-lint run` pass with zero warnings.
- [ ] `go test -race ./...` passes with no data races or goroutine leaks.
- [ ] All errors are wrapped with `%w` or handled at boundaries (no "log and return").
- [ ] `ctx context.Context` is the first parameter for all I/O, database, and network operations.
- [ ] All goroutines are bounded by `ctx.Done()`, `sync.WaitGroup`, or `errgroup.Group`.
- [ ] All exported types, functions, methods, and constants have GoDoc comments starting with their name.
- [ ] Non-obvious code blocks (locks, buffered channels, defensive workarounds) document design intent.
- [ ] (If Web UI) Assets and templates are bundled via `//go:embed`, and mutating endpoints enforce CSRF tokens.
