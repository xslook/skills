---
name: architecture
description: Design deep modules and distributed systems, audit technical debt with quantitative prioritization, survey systems for deepening opportunities, and maintain ubiquitous domain language with Architecture Decision Records (ADRs).
argument-hint: "Subsystem, module to design, or 'scan' / 'tech-debt' for an architecture review"
---

# Architecture & Codebase Design

A unified architecture discipline for designing **deep modules**, conducting **system design**, auditing and prioritizing **technical debt**, and actively maintaining ubiquitous domain language and Architecture Decision Records (ADRs).

---

## 1. Deep Module Design Vocabulary & Principles

Design code with **a lot of behavior behind a small interface**, placed at a clean seam.

### Glossary
- **Module**: Anything with an interface and an implementation (scale-agnostic: function, class, package, or subsystem).
- **Interface**: Everything a caller must know to use the module correctly (types, invariants, ordering, errors, performance).
- **Implementation**: The internal code hidden behind the interface.
- **Depth**: Leverage at the interface. A module is **deep** when substantial capability sits behind a simple interface; **shallow** when the interface is nearly as complex as its implementation.
- **Seam**: A public boundary where behavior can be observed or altered without editing internals.
- **Adapter**: A concrete object that satisfies an interface at a seam.
- **Leverage**: Capability gained per unit of interface learned.
- **Locality**: Bugs, verification, and changes concentrate in one place rather than dispersing across callers.

### Core Principles
- **The Deletion Test**: If deleting a module makes complexity vanish, it was a pass-through. If complexity reappears across $N$ callers, it was earning its keep.
- **The Interface is the Test Surface**: Callers and tests cross the same seam. If you must mock or reach past the interface, the module shape is flawed.
- **Two Adapters Make a Real Seam**: Do not introduce hypothetical seams or premature abstractions unless behavior genuinely varies.
- **Alternative Interfaces**: Consult [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md) to explore multiple interface candidates before committing.
- **Dependency Deepening**: Consult [DEEPENING.md](DEEPENING.md) for handling dependency clusters and seam boundaries.

---

## 2. System Design & Scaling Framework

When architecting subsystems, microservices, or new platforms:

### 1. Requirements & Constraints
- **Functional Requirements**: Core capabilities, workflows, user journeys.
- **Non-Functional Requirements (NFRs)**: Latency (p95/p99), throughput/QPS, availability (SLOs/SLAs), data consistency model (strict vs eventual), retention, and compliance.
- **Constraints**: Existing tech stack, infrastructure budget, delivery timelines.

### 2. High-Level Architecture & Data Flow
- Component boundaries and responsibilities.
- Synchronous vs. asynchronous communication patterns (REST, gRPC, event-driven message queues like Kafka/RabbitMQ).
- Storage choices (Relational SQL vs Document vs Key-Value vs Time-Series).

### 3. Scale, Resilience & Reliability
- Horizontal scaling bottlenecks, stateless services, and session handling.
- Caching strategy (Cache-Aside, Write-Through, invalidation semantics).
- Fault tolerance: Retries with exponential backoff and jitter, circuit breakers, dead-letter queues, rate limiting.

### 4. Trade-off Analysis
Make every trade-off explicit: Complexity vs Cost vs Scalability vs Team Familiarity. Document the key trade-offs in an ADR.

---

## 3. Architecture Review & Technical Debt Audit

Surface architectural friction and technical debt across the codebase:

### Technical Debt Categories
| Type | Examples | Risk if Unaddressed |
|------|----------|----------------------|
| **Code debt** | Duplicated logic, poor abstractions, Fowler smells | Bugs, developer drag |
| **Architecture debt** | Shallow modules, tangled coupling, wrong data store | Scalability ceilings, hard regressions |
| **Test debt** | Flaky tests, slow suites, missing integration seams | Regressions ship unnoticed |
| **Dependency debt** | Unmaintained libraries, major version drift | Security vulnerabilities, build breakage |
| **Documentation debt**| Missing runbooks, stale READMEs, tribal context | Onboarding friction, operational downtime |
| **Infrastructure debt**| Missing IaC, manual deploys, no observability | Slow recovery, silent failures |

### Prioritization Scoring Formula
Score each debt candidate on a 1–5 scale:
- **Impact (1–5)**: How much does it slow the team down?
- **Risk (1–5)**: Probability and severity of failure if left unresolved.
- **Effort (1–5)**: Implementation complexity (inverted: 1 = trivial, 5 = massive refactor).

$$\text{Priority} = (\text{Impact} + \text{Risk}) \times (6 - \text{Effort})$$

Score ranges from 2 (low impact/risk, massive effort) to 50 (critical impact/risk, quick fix).

### Audit Process
1. **Scope Hotspots**: Focus on recently churned files (`git log --oneline`) and developer friction points.
2. **Scan for Friction**:
   - Where does understanding one concept require jumping between many small files?
   - Where are interfaces nearly as large as their internal code?
   - Where have functions been extracted purely for testability while bugs hide in caller choreography?
3. **Generate Report**:
   - Write an HTML report to `$TMPDIR/architecture-review-<timestamp>.html` using Tailwind and Mermaid (see [HTML-REPORT.md](HTML-REPORT.md)).
   - Provide a terminal/markdown fallback summary in chat with prioritized remediation items.
   - For each candidate: detail Files, Problem, Solution, Priority Score, and a **Before/After diagram**.

---

## 4. Domain Modeling & ADRs

Code architecture reflects the team's domain model. Keep it sharp and documented:

### Ubiquitous Language (`CONTEXT.md`)
- Single-context repos: Keep a root `CONTEXT.md`.
- Multi-context repos: Maintain `CONTEXT-MAP.md` pointing to sub-contexts (see [CONTEXT-FORMAT.md](CONTEXT-FORMAT.md)).
- Record canonical terms with 1–2 sentence definitions and explicit `_Avoid_` lists.
- Challenge vague language: *"You're saying 'account'—do you mean Customer or User?"*

### Architecture Decision Records (`docs/adr/`)
- Record hard-to-reverse architectural choices in `docs/adr/NNNN-<slug>.md` using the format in [ADR-FORMAT.md](ADR-FORMAT.md).
- Statuses: `Proposed`, `Accepted`, `Rejected`, `Superseded`.
- Never re-litigate decisions documented in accepted ADRs unless conditions have fundamentally changed.

---

## Completion Criteria

**Done when:**
- [ ] Module interfaces are evaluated using the deep module criteria (high leverage, high locality).
- [ ] System designs define functional/non-functional requirements and scale/resilience strategies.
- [ ] Tech debt items are categorized and scored using $(\text{Impact} + \text{Risk}) \times (6 - \text{Effort})$.
- [ ] Architecture candidates include clear Before/After structural diagrams.
- [ ] Any new domain terminology is recorded in `CONTEXT.md`.
- [ ] Any architectural decision is documented as an ADR in `docs/adr/`.
