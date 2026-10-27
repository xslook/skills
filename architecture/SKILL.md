---
name: architecture
description: Design deep modules and distributed systems, audit technical debt with quantitative prioritization, survey codebases for deepening opportunities, and maintain ubiquitous domain language (CONTEXT.md) and Architecture Decision Records (ADRs). Use when the user asks to design or redesign a module/subsystem/service, review architecture, find refactoring candidates, prioritize tech debt, compare interface alternatives, or record an architectural decision.
compatibility: Works in any repository. scripts/hotspots.sh needs bash and git (read-only). The HTML report loads Tailwind and Mermaid from public CDNs, so viewing it needs network access.
metadata:
  version: "2.0"
  argument-hint: "Module/subsystem to design, 'system <name>' for system design, 'scan' for a deepening review, 'tech-debt' for a debt audit, or 'adr <decision>'"
---

# Architecture & Codebase Design

A unified architecture discipline for designing **deep modules**, conducting **system design**, auditing and prioritizing **technical debt**, and actively maintaining ubiquitous domain language and Architecture Decision Records (ADRs).

---

## Bundled Resources

Load these on demand, only when the current step needs them. Paths are relative to this skill's root.

| File | Load when |
|---|---|
| [references/DEEPENING.md](references/DEEPENING.md) | Classifying a candidate's dependencies, placing ports/adapters, planning test replacement or a migration sequence |
| [references/DESIGN-IT-TWICE.md](references/DESIGN-IT-TWICE.md) | The user wants alternative interfaces for a chosen candidate |
| [references/HTML-REPORT.md](references/HTML-REPORT.md) | Writing the `scan` / `tech-debt` HTML report (diagram patterns, tone) |
| [references/CONTEXT-FORMAT.md](references/CONTEXT-FORMAT.md) | Creating or editing `CONTEXT.md` / `CONTEXT-MAP.md` |
| [references/ADR-FORMAT.md](references/ADR-FORMAT.md) | Deciding whether a decision deserves an ADR, or writing one |
| [assets/report-template.html](assets/report-template.html) | Scaffold to copy for the HTML report |
| [scripts/hotspots.sh](scripts/hotspots.sh) | Ranking files by churn and finding co-change coupling (audit step 1) |

---

## 0. Pick a Mode First

Route the request before doing anything else. If the argument is ambiguous, infer from the user's wording; ask only if two modes are equally plausible.

| Trigger (argument or intent) | Mode | Go to |
|---|---|---|
| A module, class, package name; "redesign", "simplify this API" | **Module design** | §1 (+ [DESIGN-IT-TWICE.md](references/DESIGN-IT-TWICE.md) if alternatives wanted) |
| `system <name>`, "design a service/platform", scaling, NFRs | **System design** | §2 |
| `scan`, "where should we refactor", "find shallow modules" | **Deepening review** | §3 (deepening lens) + [HTML-REPORT.md](references/HTML-REPORT.md) |
| `tech-debt`, "prioritize debt", "audit" | **Debt audit** | §3 (all categories, scored) |
| `adr <decision>`, "record this decision", new domain term | **Domain & ADR upkeep** | §4 |

**In every mode:**
1. **Read context first.** Load `CONTEXT.md` / `CONTEXT-MAP.md` and skim `docs/adr/` if present. Use the project's domain terms; do not contradict accepted ADRs.
2. **Ground claims in code.** Cite concrete file paths (and line ranges where useful). No candidate, smell, or bottleneck without evidence.
3. **Propose, don't perform.** Architecture changes are presented for approval. Do not start a refactor, delete tests, or write ADRs/CONTEXT entries without the user's go-ahead (offering a drafted ADR is fine).

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
- **Port**: The interface declared at a seam that adapters plug into (see [DEEPENING.md](references/DEEPENING.md)).
- **Leverage**: Capability gained per unit of interface learned.
- **Locality**: Bugs, verification, and changes concentrate in one place rather than dispersing across callers.
- **Leak**: Knowledge that should be hidden behind a seam but that callers must still hold (ordering rules, internal types, retry logic, pricing rules).

> Use these terms exactly in module-level discussion and reports. In system design (§2), conventional terms like *service* and *component* are fine for deployable units, but still say *module*, *interface*, and *seam* when discussing code shape.

### Core Principles
- **The Deletion Test**: Imagine deleting the module and inlining it into its callers. If complexity vanishes, it was a pass-through. If complexity reappears across $N$ callers, it was earning its keep.
- **The Interface is the Test Surface**: Callers and tests cross the same seam. If you must mock collaborators *inside* the module or reach past the interface, the module shape is flawed. (Mocking a true external dependency at its port is fine. See [DEEPENING.md](references/DEEPENING.md).)
- **Two Adapters Make a Real Seam**: A port needs at least two justified adapters, and production plus a test adapter counts. One adapter means a hypothetical seam, which is just indirection.
- **Pull Complexity Down**: When in doubt, the module absorbs the complexity so that N callers don't each have to handle it. Sensible defaults beat required configuration.
- **Define Errors Out of Existence**: Prefer interfaces where common error cases can't arise (idempotent operations, total functions, normalized inputs) over long lists of exceptions.
- **Alternative Interfaces**: Consult [DESIGN-IT-TWICE.md](references/DESIGN-IT-TWICE.md) to explore multiple interface candidates before committing.
- **Dependency Deepening**: Consult [DEEPENING.md](references/DEEPENING.md) for handling dependency clusters and seam boundaries.

### Shallowness Signals (what to look for)
- Interface surface (params, methods, config flags, error types) comparable to implementation size.
- Pass-through methods that forward to another module with the same signature.
- Callers must invoke several methods in a specific order (temporal coupling) to get one outcome.
- The same conditional or data transformation repeated across callers.
- Functions extracted purely so they could be unit tested, while bugs live in the caller choreography between them.
- Understanding one concept requires opening many small files.

### When NOT to Deepen
- The module is stable, rarely changed, and not a bug source. Churn is what makes depth pay off.
- The cluster crosses an ownership or deployment boundary the team can't or won't change. Record the constraint in an ADR instead.
- Merging would hide genuinely independent concepts that change for different reasons.
- The only motivation is aesthetic, and no locality or leverage gain can be named.

### Module Design Workflow
1. Identify the callers and list what each must currently know (that knowledge is the *real* interface).
2. Classify dependencies (see [DEEPENING.md](references/DEEPENING.md)).
3. Sketch the target interface: entry points, invariants, error modes, and what moves behind the seam.
4. Run the Deletion Test on every module in the cluster.
5. Describe the test strategy at the new interface and which old tests get deleted.
6. Present it with a Before/After diagram and wait for approval before refactoring.

---

## 2. System Design & Scaling Framework

Use this when architecting subsystems, services, or new platforms. Work top-down, and state assumptions explicitly when the user hasn't given numbers.

### 2.1 Requirements & Constraints
- **Functional requirements**: Core capabilities, workflows, user journeys.
- **Non-functional requirements (NFRs)**: Latency (p95/p99), throughput/QPS (average and peak), availability (SLOs/SLAs), consistency model (strong vs eventual, per data type), durability, retention, privacy/compliance.
- **Constraints**: Existing tech stack, infrastructure budget, team size and skills, delivery timelines.
- **Out of scope**: Name what you are deliberately not designing.

### 2.2 Back-of-Envelope Estimation
Derive the numbers that drive design choices: requests/sec (peak ≈ 2–10× average), read:write ratio, storage growth per year, payload sizes, and fan-out. Show the arithmetic. An order-of-magnitude estimate is enough. The point is to tell whether one Postgres instance suffices or whether you need sharding.

### 2.3 High-Level Architecture & Data Flow
- Component boundaries and responsibilities. Each component should be a deep module at its own scale.
- APIs/contracts between components (key endpoints, events, or messages).
- Sync vs async communication (REST, gRPC, event-driven queues like Kafka/RabbitMQ/SQS) and *why* for each edge.
- Data model and storage choices (relational vs document vs key-value vs time-series vs object store), and who owns each dataset.
- A Mermaid diagram of components and the primary request/data flows.

### 2.4 Scale, Resilience & Reliability
- Horizontal scaling bottlenecks, stateless services, session handling, partitioning/sharding keys.
- Caching strategy (cache-aside, write-through, TTL vs explicit invalidation) and its consistency cost.
- Fault tolerance: timeouts everywhere, retries with exponential backoff and jitter (only for idempotent ops), idempotency keys, circuit breakers, dead-letter queues, rate limiting, backpressure.
- Single points of failure and the failure mode for each critical dependency ("if X is down, users see Y").
- Observability: the key metrics, logs, and traces needed to verify SLOs.

### 2.5 Trade-off Analysis & Evolution
- Make every trade-off explicit: complexity vs cost vs scalability vs team familiarity. Prefer the simplest design that meets the NFRs, plus a clear path to the next scale step.
- List the top risks and open questions.
- Draft an ADR for each hard-to-reverse choice (criteria in [ADR-FORMAT.md](references/ADR-FORMAT.md)).

### System Design Output Template
```md
# {System} Design
## Requirements (functional / NFRs / constraints / out of scope)
## Estimates (with arithmetic)
## Architecture (Mermaid diagram + component responsibilities)
## Data model & storage
## Key flows (sequence diagrams for 1–3 critical paths)
## Scale & resilience
## Trade-offs, risks, open questions
## Proposed ADRs
```

---

## 3. Architecture Review & Technical Debt Audit

Surface architectural friction and technical debt across the codebase. A **`scan`** focuses on the deepening lens (architecture and test debt viewed through §1). A **`tech-debt`** audit covers all categories.

### Technical Debt Categories
| Type | Examples | Risk if Unaddressed |
|------|----------|----------------------|
| **Code debt** | Duplicated logic, poor abstractions, Fowler smells | Bugs, developer drag |
| **Architecture debt** | Shallow modules, tangled coupling, leaks across seams, wrong data store | Scalability ceilings, hard regressions |
| **Test debt** | Flaky tests, slow suites, tests coupled to internals, missing integration seams | Regressions ship unnoticed |
| **Dependency debt** | Unmaintained libraries, major version drift, known CVEs | Security vulnerabilities, build breakage |
| **Documentation debt** | Missing runbooks, stale READMEs, tribal context, no CONTEXT.md/ADRs | Onboarding friction, operational downtime |
| **Infrastructure debt** | Missing IaC, manual deploys, no observability | Slow recovery, silent failures |

### Prioritization Scoring Formula
Score each candidate on a 1–5 scale, with a one-line justification per score:
- **Impact (1–5)**: How much does it slow the team down or degrade the product? (5 = blocks work daily)
- **Risk (1–5)**: Probability × severity of failure if left unresolved. (5 = likely outage, data loss, or security incident)
- **Effort (1–5)**: Implementation cost. (1 = under a day, 3 = about a sprint, 5 = multi-sprint refactor). The formula inverts it, so cheaper work scores higher.

$$\text{Priority} = (\text{Impact} + \text{Risk}) \times (6 - \text{Effort})$$

Scores range from 2 (low impact/risk, massive effort) to 50 (critical impact/risk, quick fix).

| Score | Tier | Action |
|---|---|---|
| ≥ 30 | **Now** | Schedule this sprint |
| 15–29 | **Next** | Plan in the next 1–2 cycles |
| < 15 | **Later** | Track; revisit if churn rises |

Override: any item with **Risk = 5** goes into **Now** regardless of score, though it may need to be broken into smaller items first.

### Audit Process
1. **Scope hotspots**: Rank files by churn, then intersect with size and complexity. Churn × complexity is where debt costs the most.
   ```bash
   # Most-changed files (defaults: last 6 months, top 30)
   bash scripts/hotspots.sh --repo <target-repo>
   # Plus the files most often committed together with a hotspot (hidden coupling)
   bash scripts/hotspots.sh --repo <target-repo> --file <hotspot> --since "3 months ago"
   ```
   Run it from the skill root, or call it by absolute path. If the target isn't a git repo, the script exits non-zero; fall back to file sizes and the user's input.
   Also ask the user where developers feel the most friction. Their answer outranks the metrics.
2. **Scan for friction** using the Shallowness Signals (§1), plus:
   - Files that always change together but live in different modules (a leak across a seam).
   - Tests that break on refactors without behavior changes (testing past the interface).
   - Dependency drift (`npm outdated`, `pip list --outdated`, `go list -m -u all`, etc.) and known CVEs.
3. **Verify each candidate**: Open the code and confirm it. Drop anything you can't back with a file path.
4. **Score and tier**: Apply the formula. Keep it to the **top 5–10** candidates; a long list gets ignored.
5. **Generate the report**:
   - Copy [assets/report-template.html](assets/report-template.html) to `${TMPDIR:-/tmp}/architecture-review-<YYYYMMDD-HHMM>.html` and fill it in following [HTML-REPORT.md](references/HTML-REPORT.md). Tell the user the path, and offer to open it with `open` / `xdg-open`.
   - Also give a markdown summary in chat: a table of candidates sorted by Priority (Name · Category · I/R/E · Score · Tier · Files), then the top recommendation.
   - Each candidate needs: Files, Problem, Solution, Priority score (with I/R/E), dependency category (for deepening candidates), and a **Before/After diagram**.
6. **Offer next steps**: Design-It-Twice for the top candidate, an ADR draft, or a phased refactor plan. Don't start any of them unasked.

---

## 4. Domain Modeling & ADRs

Code architecture reflects the team's domain model. Keep it sharp and documented.

### Ubiquitous Language (`CONTEXT.md`)
- Single-context repos keep a root `CONTEXT.md`. Multi-context repos keep a `CONTEXT-MAP.md` pointing to sub-contexts. See [CONTEXT-FORMAT.md](references/CONTEXT-FORMAT.md).
- Record canonical terms with 1–2 sentence definitions and explicit `_Avoid_` lists.
- Challenge vague or overloaded language as it comes up: *"You're saying 'account'. Do you mean Customer or User?"*
- Flag drift between code and language: a class named `Client` when `CONTEXT.md` says **Customer** is a rename candidate.
- Add a term once it is resolved in conversation, and tell the user what you added.

### Architecture Decision Records (`docs/adr/`)
- Record hard-to-reverse choices in `docs/adr/NNNN-<slug>.md` using [ADR-FORMAT.md](references/ADR-FORMAT.md). Offer an ADR only when all three criteria there are met.
- Statuses: `proposed`, `accepted`, `deprecated`, `superseded by ADR-NNNN`.
- Never edit the decision in an accepted ADR. To change it, write a new ADR and mark the old one `superseded by ADR-NNNN`.
- Don't re-litigate accepted ADRs unless conditions have fundamentally changed. If they have, say which condition changed and propose a superseding ADR.

---

## Completion Criteria

**Always:**
- [ ] Existing `CONTEXT.md` and ADRs were read and respected. Domain terms are used consistently.
- [ ] Every claim is backed by concrete file paths.
- [ ] No refactor, test deletion, or doc write happened without user approval.

**Module design:**
- [ ] Interfaces were evaluated for depth (leverage, locality) and passed the Deletion Test.
- [ ] Dependencies were classified, and the test strategy targets the new interface.
- [ ] A Before/After diagram was included.

**System design:**
- [ ] Functional requirements, NFRs, and constraints are defined, and estimates show their arithmetic.
- [ ] The architecture diagram, data ownership, scale/resilience strategy, and failure modes are covered.
- [ ] Trade-offs are explicit, and hard-to-reverse choices have ADR drafts.

**Scan / tech-debt audit:**
- [ ] Candidates are categorized, scored with $(\text{Impact} + \text{Risk}) \times (6 - \text{Effort})$, and tiered.
- [ ] Each candidate has a Before/After diagram. The HTML report path is shared and a markdown summary given.

**Domain & ADRs:**
- [ ] New domain terms are recorded in `CONTEXT.md`.
- [ ] ADRs are numbered sequentially and given a status.
