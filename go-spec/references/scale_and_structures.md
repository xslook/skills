# Go Project Scale and Directory Structure Specification

---

## 1. Scale Decision Matrix

| Scale Category | Estimated Lines of Code / Modules | Typical Scenarios | Recommended Architecture Pattern |
| :--- | :--- | :--- | :--- |
| **Small (CLI / Tools)** | < 1,000 LoC / Single focus | Standalone CLI tools, automation scripts, single-function SDKs/libraries, POC prototypes | **Root Main + Internal Layout** |
| **Medium (Services / APIs)** | 1,000 ~ 15,000 LoC / Typical business apps | Standalone backend APIs, microservices, CRUD apps, background workers | **Standard Go Project Layout** (`cmd/`, `internal/`, `pkg/`) |
| **Large (Enterprise / Core)** | > 15,000 LoC / Multi-domain complex systems | Core transactional backends, modular monoliths, multi-team microservices | **Clean Architecture / Hexagonal / DDD Layering** |

---

## 2. Small Project Specification: Root Main + Internal Layout

### Characteristics
- Single responsibility, lightweight lifecycle, not meant to be imported by external projects.
- **Core Isolation Rule**: Retain only `main.go` at the repository root as the sole executable entrypoint. Keep all other implementation details inside `internal/` to leverage Go compiler package boundaries while keeping the root clean.

### Recommended Directory Structure
```text
my-cli/
├── go.mod
├── go.sum
├── main.go            # Sole root entrypoint: parses flags, reads config, initializes and runs internal app
├── internal/          # Private implementation code (all other code lives here)
│   ├── app/           # Core application runner and commands
│   │   ├── app.go
│   │   └── app_test.go
│   ├── config/        # Configuration schema and loading
│   │   └── config.go
│   └── client/        # External clients or low-level adapters
│       ├── client.go
│       └── client_test.go
├── README.md
└── Makefile
```

### Key Rules
1. **Minimal Root**: The root directory contains only `main.go`, `go.mod`, `README.md`, and build scripts. `main.go` remains thin, solely bridging CLI flags and invocation of `internal/` packages.
2. **Private Encapsulation**: Domain logic, config loading, and adapters reside under `internal/` subpackages (or `internal/app/`), preventing external modules from unintentionally importing internal implementations.
3. **Co-located Tests**: Unit tests live directly alongside the code they test inside `internal/`.

---

## 3. Medium Project Specification: Standard Go Project Layout

### Characteristics
- Production-grade Web APIs, gRPC services, or standalone business microservices.
- Clear separation between entrypoints, private application business logic, and reusable public utilities.

### Recommended Directory Structure
```text
my-service/
├── cmd/
│   └── server/
│       └── main.go           # Application entrypoint (wires dependencies and listens for OS signals)
├── internal/                 # Private code (Go compiler enforces zero external module imports)
│   ├── app/                  # Application assembly layer (server startup, graceful shutdown)
│   │   └── app.go
│   ├── config/               # Configuration loading and schema validation
│   │   └── config.go
│   ├── handler/              # Transport layer / API controllers (HTTP/REST or gRPC handlers)
│   │   ├── user_handler.go
│   │   └── user_handler_test.go
│   ├── service/              # Business use cases and application services
│   │   ├── user_service.go
│   │   └── user_service_test.go
│   ├── repository/           # Data persistence layer (DB / Redis / external RPC adapters)
│   │   ├── user_repo.go
│   │   └── user_repo_test.go
│   └── model/                # Internal data structures and entities
│       └── user.go
├── pkg/                      # Public packages safe for external import (non-business specific)
│   └── httpx/                # Example: Generic reusable HTTP client utility
│       └── client.go
├── api/                      # Protocol definition files (OpenAPI / Swagger / Proto schemas)
│   └── proto/
│       └── v1/
│           └── user.proto
├── configs/                  # Configuration templates (YAML / ENV)
│   └── config.example.yaml
├── scripts/                  # Deployment, build, and migration scripts
│   └── migrations/
│       └── 000001_init.up.sql
├── .golangci.yml
├── Dockerfile
├── Makefile
├── go.mod
└── go.sum
```

### Key Rules
1. **Ultra-thin `cmd/`**: `main.go` handles only three tasks: loading configuration, wiring dependencies (Manual DI), and starting servers while listening for OS termination signals. Never write heavy business logic in `main.go`.
2. **Strict Encapsulation via `internal/`**: All core business logic must be placed inside `internal/`, leveraging the Go compiler's strict boundary enforcement to prevent accidental external coupling.
3. **Exercise Caution with `pkg/`**: Only place code in `pkg/` if it is truly generic and intentionally designed to be imported by outside repositories; otherwise, default to `internal/`.

---

## 4. Large Project Specification: Clean / Hexagonal / DDD Architecture

### Characteristics
- Deep business logic with long lifecycles that must remain decoupled from specific database engines (GORM/sqlc) and transport protocols (HTTP/gRPC).
- Strictly follows the Dependency Inversion Principle: **The core domain model must not depend on any external framework, ORM, or transport library.**

### Recommended Directory Structure
```text
enterprise-service/
├── cmd/
│   └── enterprise-server/
│       └── main.go
├── internal/
│   ├── domain/               # [Core Domain Layer] Pure entities and interfaces (Zero external dependencies)
│   │   ├── order/
│   │   │   ├── entity.go     # Domain entities & aggregate roots (enforcing business invariants)
│   │   │   ├── value_objects.go
│   │   │   ├── repository.go # Repository interface (defined by Domain, implemented by Infrastructure)
│   │   │   └── events.go     # Domain event declarations
│   │   └── customer/
│   ├── usecase/              # [Application Use Cases] Business flow orchestration, transaction boundaries
│   │   ├── order/
│   │   │   ├── create_order.go
│   │   │   ├── create_order_test.go
│   │   │   └── query_order.go
│   ├── adapter/              # [Adapters Layer] Inbound & Outbound adapters
│   │   ├── inbound/          # Primary / Driver Adapters (triggers the system)
│   │   │   ├── http/         # REST API routes and controllers
│   │   │   │   ├── router.go
│   │   │   │   └── order_controller.go
│   │   │   ├── grpc/         # gRPC server implementation
│   │   │   └── event_sub/    # Message queue consumers (Kafka / RabbitMQ)
│   │   └── outbound/         # Secondary / Driven Adapters (called by Use Cases)
│   │       ├── repository/   # Concrete persistence implementation (Postgres / MySQL / sqlc)
│   │       │   └── order_pg_repo.go
│   │       ├── cache/        # Cache adapter (Redis)
│   │       │   └── order_redis.go
│   │       └── event_pub/    # Domain event publishers
│   └── infrastructure/       # [Infrastructure Layer] DB connection pools, telemetry, global config
│       ├── database/
│       ├── telemetry/
│       └── config/
├── api/
├── deployments/
├── Makefile
├── go.mod
└── go.sum
```

### Dependency Flow (Golden Rule)
```text
Inbound Adapters (HTTP/gRPC) ──> Use Cases ──> Domain (Entities)
                                     │
                                     └──> Outbound Interfaces (Defined in Domain/UseCase)
                                                ▲
                                                │ (Implements)
                                  Outbound Adapters (Postgres/Redis)
```
- **Domain layer** must not import any `adapter` or external frameworks (e.g., `gin`, `gorm`, `sqlx`).
- Inbound requests (HTTP DTOs) are converted to Use Case command structs, processed according to domain rules, returned as Use Case response models, and formatted as HTTP responses by the controller.

---

## 5. Multi-Module Workspace Management (Go Workspaces)

For multi-service repositories or microservice monorepos, use Go 1.18+ workspaces (`go.work`):
```text
monorepo/
├── go.work
├── go.work.sum
├── services/
│   ├── order-service/        # Independent go.mod
│   │   ├── go.mod
│   │   └── cmd/
│   └── user-service/         # Independent go.mod
│       ├── go.mod
│       └── cmd/
└── shared/
    └── contracts/            # Shared Protobuf / DTO contracts
        └── go.mod
```

### Example `go.work`
```go
go 1.23.0

use (
    ./services/order-service
    ./services/user-service
    ./shared/contracts
)
```
