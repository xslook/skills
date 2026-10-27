# Deepening

How to deepen a cluster of shallow modules safely, given its dependencies. Assumes the vocabulary in [SKILL.md](SKILL.md): **module**, **interface**, **seam**, **adapter**.

## Dependency categories

When assessing a candidate for deepening, classify its dependencies. The category determines how the deepened module is tested across its seam.

### 1. In-process

Pure computation, in-memory state, no I/O. Always deepenable: merge the modules and test through the new interface directly. No adapter needed.

### 2. Local-substitutable

Dependencies that have local test stand-ins (PGLite for Postgres, in-memory filesystem). Deepenable if the stand-in exists. The deepened module is tested with the stand-in running in the test suite. The seam is internal; no port at the module's external interface.

### 3. Remote but owned (Ports & Adapters)

Your own services across a network boundary (microservices, internal APIs). Define a **port** (interface) at the seam. The deep module owns the logic; the transport is injected as an **adapter**. Tests use an in-memory adapter. Production uses an HTTP/gRPC/queue adapter.

Recommendation shape: *"Define a port at the seam, implement an HTTP adapter for production and an in-memory adapter for testing, so the logic sits in one deep module even though it's deployed across a network."*

### 4. True external (Mock)

Third-party services (Stripe, Twilio, etc.) you don't control. The deepened module takes the external dependency as an injected port; tests provide a mock adapter.

Mock **only at this port**, never the module's own internals. Keep the port narrow and phrased in your domain terms (`chargeCustomer(amount)`, not a mirror of the vendor SDK), so the mock stays trivial and vendor quirks stay inside the production adapter. Back the production adapter with a small set of contract tests against the vendor sandbox, where one exists.

## Choosing the category

Classify by the *hardest* dependency in the cluster. If you're unsure between two categories, pick the one with fewer seams. You can always add a port later, once a second adapter is actually needed.

| Category | Port at external interface? | Test with |
|---|---|---|
| In-process | No | Real code |
| Local-substitutable | No | Local stand-in |
| Remote but owned | Yes | In-memory adapter |
| True external | Yes | Mock adapter + contract tests |

## Seam discipline

- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a port unless at least two adapters are justified (typically production + test). A single-adapter seam is just indirection.
- **Internal seams vs external seams.** A deep module can have internal seams (private to its implementation, used by its own tests) as well as the external seam at its interface. Don't expose internal seams through the interface just because tests use them.

## Testing strategy: replace, don't layer

- Old unit tests on shallow modules become waste once tests at the deepened module's interface exist; delete them.
- Write new tests at the deepened module's interface. The **interface is the test surface**.
- Tests assert on observable outcomes through the interface, not internal state.
- Tests should survive internal refactors, since they describe behaviour, not implementation. If a test has to change when the implementation changes, it's testing past the interface.

## Migration sequence

Deepen incrementally so that every step leaves the build green:

1. **Pin behaviour**: Write tests at the *new* interface first, initially delegating to the existing shallow modules. If the new interface can't express a behaviour the old tests cover, the interface is missing something, so fix it now.
2. **Move callers**: Migrate callers to the new interface one at a time. Each migration should be a small, reviewable diff.
3. **Absorb**: Move the shallow modules' logic behind the seam (make it private, inline it, or merge files).
4. **Delete**: Remove the old shallow modules and their tests once nothing references them, after confirming the new interface tests cover what they asserted.
5. **Record**: If the new seam placement would surprise a future reader, draft an ADR (see [ADR-FORMAT.md](references/ADR-FORMAT.md)).

Propose this sequence to the user with concrete file paths for each step. Don't execute it without their approval.
