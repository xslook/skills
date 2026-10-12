# Logging & Observability Specification

---

## 1. Structured Logging Specification (`log/slog`)

### 1.1 Core Principles
1. **Structured Only**: Never concatenate raw strings for logging (e.g., logging after `fmt.Sprintf`). Always use key-value attributes (`slog.Attr` or key-value pairs).
2. **Context-Aware**: Any function with `ctx` must use `slog.InfoContext(ctx, ...)`, `slog.ErrorContext(ctx, ...)`, allowing middleware or custom handlers to automatically extract tracing metadata (`trace_id`, `span_id`, `request_id`).
3. **Log Level Semantics**:
   - `DEBUG`: Diagnostic details, enabled only during local development or targeted troubleshooting.
   - `INFO`: Significant lifecycle checkpoints (e.g., service started, port bound, batch job finished).
   - `WARN`: Recoverable degradation, fallback execution, upcoming deprecation notices, or transient external dependency jitter.
   - `ERROR`: A request or job failed and needs attention. Log once, at the boundary that handles the error (see golden rule 1).
4. **Global slog Methods (No Logger Passing)**: See golden rule 6 in [SKILL.md](../SKILL.md). Configure once via `slog.SetDefault()` in `main`; use `slog.*Context(ctx, ...)` everywhere else.
5. **Constant Messages, Snake-Case Keys**: Messages are static strings (`"order created"`); variable data goes in attributes with `snake_case` keys. Don't mix `slog.Attr` and loose key-value pairs in one call. (Enforced by `sloglint` in [golangci.yml](../templates/golangci.yml).)
6. **Errors as `slog.Any("error", err)`**: Use one consistent key (`error`) so log queries work across services.

### 1.2 Contextual Trace ID Injection Handler
A `slog.Handler` wrapper that adds request-scoped IDs from `context.Context` to every record:

```go
// Package logctx enriches slog records with request-scoped identifiers.
package logctx

import (
	"context"
	"log/slog"
)

// Unexported key type: no other package can collide with or overwrite these keys.
type ctxKey int

const (
	traceIDKey ctxKey = iota
	requestIDKey
)

// WithTraceID returns a copy of ctx carrying the trace ID.
func WithTraceID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, traceIDKey, id)
}

// WithRequestID returns a copy of ctx carrying the request ID.
func WithRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, requestIDKey, id)
}

// Handler adds trace_id and request_id from the context to each record.
type Handler struct {
	inner slog.Handler
}

// NewHandler wraps inner.
func NewHandler(inner slog.Handler) *Handler { return &Handler{inner: inner} }

func (h *Handler) Enabled(ctx context.Context, l slog.Level) bool { return h.inner.Enabled(ctx, l) }

func (h *Handler) Handle(ctx context.Context, r slog.Record) error {
	if id, ok := ctx.Value(traceIDKey).(string); ok && id != "" {
		r.AddAttrs(slog.String("trace_id", id))
	}
	if id, ok := ctx.Value(requestIDKey).(string); ok && id != "" {
		r.AddAttrs(slog.String("request_id", id))
	}
	return h.inner.Handle(ctx, r)
}

// WithAttrs and WithGroup MUST re-wrap. If you only embed slog.Handler, these
// calls return the bare inner handler, and every logger derived via
// slog.With(...) silently stops emitting trace_id and request_id.
func (h *Handler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &Handler{inner: h.inner.WithAttrs(attrs)}
}

func (h *Handler) WithGroup(name string) slog.Handler {
	return &Handler{inner: h.inner.WithGroup(name)}
}
```

Setup in `main`, plus request-ID middleware:

```go
slog.SetDefault(slog.New(logctx.NewHandler(
	slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}),
)))

func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get("X-Request-ID")
		if id == "" || len(id) > 64 { // Client-supplied: bound it so it can't bloat or forge log lines.
			id = rand.Text() // crypto/rand, Go 1.24+
		}
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(logctx.WithRequestID(r.Context(), id)))
	})
}
```

> [!TIP]
> Make the log level adjustable at runtime with a `slog.LevelVar` passed as `HandlerOptions.Level`, e.g. toggled by an admin endpoint or a `LOG_LEVEL` env var at startup.

> [!NOTE]
> **Testing trade-off of the global logger**: parallel tests share `slog.Default()`, so per-test log capture isn't possible. Assert on returned errors and observable behavior, not on log output. If a test truly must inspect logs, run it without `t.Parallel()` and swap `slog.SetDefault` with a handler that writes to a buffer, restoring the original in `t.Cleanup`.

### 1.3 Logging Examples (Good vs Bad)

#### ❌ Anti-Patterns
```go
// Bad 1: Unstructured string concatenation
slog.Info(fmt.Sprintf("user %d created order %s with amount %f", userID, orderID, amount))

// Bad 2: Missing context prevents request tracing
slog.Error("failed to query database", "err", err)

// Bad 3: Logging and returning the error (Log & Return creates log storms)
if err := repo.Save(ctx, order); err != nil {
    slog.ErrorContext(ctx, "failed to save order", "error", err) // Causes duplicated logs up the stack
    return fmt.Errorf("save order: %w", err)
}

// Bad 4: Leaking sensitive credentials
slog.InfoContext(ctx, "user login", "username", u, "password", pwd, "token", jwtToken)
```

#### ✅ Best Practices
```go
// Good 1: Structured logging attributes
// Strongly-typed attributes (slog.Attr) provide type safety:
slog.InfoContext(ctx, "order created successfully",
    slog.Int64("user_id", userID),
    slog.String("order_id", orderID),
    slog.Float64("amount", amount),
)

// Loosely-typed key-value pairs are also acceptable and idiomatic:
slog.InfoContext(ctx, "order created successfully",
    "user_id", userID,
    "order_id", orderID,
    "amount", amount,
)

// Good 2: Handle error only once (logged at the outermost handler/controller boundary)
if err := svc.CreateOrder(ctx, req); err != nil {
    // The transport controller acts as the boundary, logging the full context and returning HTTP status
    slog.ErrorContext(ctx, "failed to handle create_order request",
        slog.Any("error", err),
        slog.String("order_id", req.OrderID),
    )
    http.Error(w, "internal server error", http.StatusInternalServerError)
    return
}
```

---

## 2. Metrics Specification (RED Method)

All microservices and public endpoints must expose metrics following the **RED Method**:
- **R (Rate)**: Requests processed per second (Throughput).
- **E (Errors)**: Failed requests per second (Error Rate).
- **D (Duration)**: Latency distribution histogram (P90, P99).

### Standard Prometheus Middleware Example
```go
package telemetry

import (
	"net/http"
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests processed.",
		},
		[]string{"method", "path", "status"},
	)

	httpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "Histogram of response latency (seconds) for HTTP requests.",
			Buckets: prometheus.DefBuckets, // [.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10]
		},
		[]string{"method", "path"},
	)
)

type statusRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (rec *statusRecorder) WriteHeader(code int) {
	rec.statusCode = code
	rec.ResponseWriter.WriteHeader(code)
}

// Unwrap lets http.ResponseController reach the underlying writer (Flush, deadlines, hijack).
func (rec *statusRecorder) Unwrap() http.ResponseWriter { return rec.ResponseWriter }

// MetricsMiddleware must wrap the ServeMux directly. The mux sets r.Pattern on
// the request it receives; a middleware in between that calls r.WithContext
// passes a copy, and this outer request never sees the pattern.
func MetricsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(rec, r)

		// r.Pattern (Go 1.23+) is the matched route template, e.g. "GET /users/{id}".
		// Never label with r.URL.Path: every distinct ID creates a new time series.
		route := r.Pattern
		if route == "" {
			route = "unmatched"
		}

		httpRequestsTotal.WithLabelValues(r.Method, route, strconv.Itoa(rec.statusCode)).Inc()
		httpRequestDuration.WithLabelValues(r.Method, route).Observe(time.Since(start).Seconds())
	})
}
```

---

## 3. Distributed Tracing (OpenTelemetry)

> [!IMPORTANT]
> **Explicit Request Only**: Only add OpenTelemetry (OTel) or distributed tracing when the user explicitly requests it.
> Default observability relies on structured logging (`slog` with context-propagated `trace_id` / `request_id`) and RED metrics, avoiding premature introduction of complex tracing agents and collectors. When distributed tracing is explicitly requested, implement using the pattern below:

### OpenTelemetry Span Creation & Propagation (When Explicitly Requested)
```go
package service

import (
	"context"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
)

var tracer = otel.Tracer("order-service")

func (s *OrderService) ProcessOrder(ctx context.Context, orderID string) (err error) {
	// Create span
	ctx, span := tracer.Start(ctx, "OrderService.ProcessOrder")
	defer func() {
		if err != nil {
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
		}
		span.End()
	}()

	span.SetAttributes(attribute.String("order.id", orderID))

	// Pass ctx downstream
	return s.repo.UpdateOrderStatus(ctx, orderID, "PROCESSING")
}
```

---

## 4. Health Checks & Probes Specification

In cloud-native/Kubernetes environments, separate the following two probes:

1. **Liveness Probe (`GET /healthz/live`)**:
   - Purpose: Checks whether the process is alive or deadlocked.
   - Behavior: Returns `200 OK` as long as the HTTP server responds. **Never ping databases or external dependencies here** (preventing dependency blips from triggering cascading pod restarts across the cluster).
2. **Readiness Probe (`GET /healthz/ready`)**:
   - Purpose: Checks whether the service is ready to accept incoming traffic.
   - Behavior: Pings core downstream dependencies (database ping, Redis ping, message queue connections). Returns `503 Service Unavailable` on failure, **and as soon as shutdown begins**, so the load balancer stops sending traffic before `Server.Shutdown` drains connections.

```go
// Pinger is satisfied by *sql.DB (PingContext) or a small adapter around any client.
type Pinger interface {
	PingContext(ctx context.Context) error
}

// Health serves liveness and readiness probes.
type Health struct {
	deps     map[string]Pinger
	draining atomic.Bool
}

func NewHealth(deps map[string]Pinger) *Health { return &Health{deps: deps} }

// StartDraining makes readiness fail. Call it on SIGTERM, wait a few seconds
// for the load balancer to notice, then call srv.Shutdown.
func (h *Health) StartDraining() { h.draining.Store(true) }

func (h *Health) Register(mux *http.ServeMux) {
	mux.HandleFunc("GET /healthz/live", func(w http.ResponseWriter, r *http.Request) {
		writeStatus(w, r, http.StatusOK, map[string]string{"status": "alive"})
	})

	mux.HandleFunc("GET /healthz/ready", func(w http.ResponseWriter, r *http.Request) {
		if h.draining.Load() {
			writeStatus(w, r, http.StatusServiceUnavailable, map[string]string{"status": "draining"})
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()
		for name, dep := range h.deps {
			if err := dep.PingContext(ctx); err != nil {
				slog.WarnContext(ctx, "readiness dependency check failed", slog.String("dependency", name), slog.Any("error", err))
				writeStatus(w, r, http.StatusServiceUnavailable, map[string]string{"status": "unready", "dependency": name})
				return
			}
		}
		writeStatus(w, r, http.StatusOK, map[string]string{"status": "ready"})
	})
}

func writeStatus(w http.ResponseWriter, r *http.Request, code int, body map[string]string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		slog.DebugContext(r.Context(), "write health response", slog.Any("error", err))
	}
}
```
