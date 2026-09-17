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
   - `ERROR`: Failures requiring developer intervention, unhandled errors, or operations disrupting business workflows.

### 1.2 Contextual Trace ID Injection Handler
Using a custom `slog.Handler` wrapper to automatically extract tracing IDs from `context.Context`:

```go
package logger

import (
	"context"
	"log/slog"
)

type contextKey string

const (
	TraceIDKey   contextKey = "trace_id"
	RequestIDKey contextKey = "request_id"
)

type ContextHandler struct {
	slog.Handler
}

func (h *ContextHandler) Handle(ctx context.Context, r slog.Record) error {
	if ctx != nil {
		if traceID, ok := ctx.Value(TraceIDKey).(string); ok && traceID != "" {
			r.AddAttrs(slog.String("trace_id", traceID))
		}
		if reqID, ok := ctx.Value(RequestIDKey).(string); ok && reqID != "" {
			r.AddAttrs(slog.String("request_id", reqID))
		}
	}
	return h.Handler.Handle(ctx, r)
}
```

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
// Good 1: Strongly-typed structured key-value attributes
slog.InfoContext(ctx, "order created successfully",
    slog.Int64("user_id", userID),
    slog.String("order_id", orderID),
    slog.Float64("amount", amount),
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

func MetricsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(rec, r)

		duration := time.Since(start).Seconds()
		path := r.URL.Path // In production, use route templates like "/users/{id}" to prevent cardinality explosion

		httpRequestsTotal.WithLabelValues(r.Method, path, strconv.Itoa(rec.statusCode)).Inc()
		httpRequestDuration.WithLabelValues(r.Method, path).Observe(duration)
	})
}
```

---

## 3. Distributed Tracing (OpenTelemetry)

> [!NOTE]
> **Applicability Boundary**: For **small and medium projects**, distributed tracing (OpenTelemetry / Jaeger) is **not mandatory** unless explicitly requested.
> Small and medium systems should focus on structured logging (`slog` with context-propagated `trace_id` / `request_id`) and RED metrics, avoiding premature introduction of complex tracing agents and collectors. Large distributed microservices must follow the tracing standard below.

### OpenTelemetry Span Creation & Propagation (For Large/Distributed Systems)
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
   - Behavior: Pings core downstream dependencies (database ping, Redis ping, message queue connections). Returns `503 Service Unavailable` on failure.

```go
func RegisterHealthRoutes(mux *http.ServeMux, db *sql.DB, rdb *redis.Client) {
	// Liveness Probe
	mux.HandleFunc("GET /healthz/live", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"alive"}`))
	})

	// Readiness Probe
	mux.HandleFunc("GET /healthz/ready", func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		if err := db.PingContext(ctx); err != nil {
			http.Error(w, `{"status":"unready","reason":"database unreachable"}`, http.StatusServiceUnavailable)
			return
		}
		if err := rdb.Ping(ctx).Err(); err != nil {
			http.Error(w, `{"status":"unready","reason":"redis unreachable"}`, http.StatusServiceUnavailable)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ready"}`))
	})
}
```
