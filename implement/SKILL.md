---
name: implement
description: Implement features, bugfixes, or specifications in code. Supports single-session test-driven development (TDD) and multi-ticket concurrent subagent orchestration across git worktrees.
argument-hint: "Spec path, ticket reference, or description of work"
---

# Implement

A comprehensive implementation discipline for delivering software from specifications, tickets, or user requirements.

Supports two operational workflows:
- **Mode A (Single-Session TDD)**: Interactive vertical-slice development within the current workspace.
- **Mode B (Task Graph Orchestration)**: Parallel implementation of multi-ticket graphs using concurrent subagents across git worktrees.

---

## Testing Principles & Strategy

All implementation adheres to strict **Test-Driven Development (TDD)** and balanced test architecture:

### 1. The Testing Pyramid
Balance test investments across three tiers:
- **E2E Tests** (Top): Few, realistic, high confidence, slower execution. Verify critical user journeys end-to-end.
- **Integration Tests** (Middle): Moderate count, test interactions across real seams, databases, or API contracts.
- **Unit Tests** (Base): Fast, focused, isolated. Verify pure logic, edge cases, and calculation boundaries.

### 2. Strategy by Component Type
- **API Endpoints**: Unit tests for domain logic; integration tests for HTTP status codes, headers, and authentication; contract/schema tests for request/response serialization.
- **Data Pipelines & Storage**: Input validation, transform correctness, idempotency tests, and database schema migrations.
- **Frontend / UI**: Component render tests, user interaction flows, accessibility checks, and state/store transitions.
- **Infrastructure & Services**: Health check endpoints, smoke tests, configuration validation, and graceful shutdown.

### 3. Verify Behavior Through Public Seams
- A **seam** is the public boundary where behavior is observed without reaching into private internals. Confirm the seams under test before writing code.
- Consult reference guides:
  - [tests.md](tests.md): Detailed examples of behavior-focused tests versus brittle tests, and testing strategies.
  - [mocking.md](mocking.md): Guidelines on fakes versus mocks.
- **Anti-patterns to reject**:
  - *Implementation-coupled*: Mocking internal collaborators or testing private methods. Breaks during refactoring.
  - *Tautological*: Assertions that recompute expected values using the same code path. Expected values must come from independent fixtures or specs.
  - *Horizontal slicing*: Writing all tests first, then all code. Work in **vertical slices** (tracer bullets) instead.

---

## Mode A: Single-Session Implementation (TDD Loop)

Use for single features, bugfixes, or individual tickets worked sequentially:

### 1. Ingest & Agree Seams
- Read the ticket or spec. Anchor identifiers in `CONTEXT.md` domain language.
- Confirm the public seam with the user:
  *"I will test this behavior at `<Module>` using its public interface. Does this seam match expectations?"*

### 2. Prefactor First (Optional)
- If the current design resists the change, restructure first without changing behavior.
- Ensure existing tests remain green.

### 3. Vertical-Slice Loop
For each requirement:
1. **Red**: Write one failing test at the confirmed seam asserting user-facing behavior.
2. **Green**: Write the minimal production code necessary to pass.
3. **Verify**: Run the targeted test and quick typecheck.
4. **Repeat**: Advance to the next vertical slice.

### 4. Full Verification & Self-Review
1. Run the full test suite and typechecker (`npm test`, `tsc --noEmit`).
2. Self-review the diff along both **Spec** and **Standards** axes (per [`code-review`](../code-review/SKILL.md)).
3. Create an atomic commit referencing the ticket/spec.

---

## Mode B: Concurrent Task Graph Orchestration (Worktrees)

Use for large specifications broken into a dependency graph of multiple tickets (from `/spec`):

1. **Ingest Task Graph**:
   - Read the spec and ticket graph. Identify the initial **frontier** (all unblocked tickets).
2. **Setup Worktree Quarantine & Integration Branch**:
   - Ensure `.worktrees/` is ignored so nested trees are never tracked:
     ```bash
     grep -qxF '.worktrees/' .gitignore 2>/dev/null || echo '.worktrees/' >> .gitignore
     ```
   - Create and check out the integration PR branch:
     ```bash
     git checkout -b feat/<feature-name>
     ```
3. **Exploration Subagent (Optional)**:
   - Run a read-only exploration subagent to research relevant files and write architectural notes to `.scratch/notes/`.
4. **Dispatch Implementer Subagents**:
   - For each ticket on the frontier, dispatch an implementer subagent.
   - Each implementer works in an isolated worktree under `.worktrees/<ticket-id>` on its own branch branched from `feat/<feature-name>`:
     ```bash
     git worktree add .worktrees/<ticket-id> -b ticket/<ticket-id> feat/<feature-name>
     ```
   - Set the subagent's working directory to `.worktrees/<ticket-id>`.
   - Implementers follow Mode A internally (TDD loop + local verification at public seams).
5. **Merge & Advance Frontier**:
   - As each ticket completes and passes its local checks, merge its branch into `feat/<feature-name>`:
     ```bash
     git checkout feat/<feature-name>
     git merge --no-ff ticket/<ticket-id> -m "feat(ticket): implement <ticket-id>"
     ```
   - If merge conflicts arise, invoke [`git-workflow`](../git-workflow/SKILL.md) for intent-based 3-way resolution.
   - Clean up the finished worktree and prune:
     ```bash
     git worktree remove .worktrees/<ticket-id>
     git branch -d ticket/<ticket-id>
     git worktree prune
     ```
   - Recompute the frontier: newly unblocked downstream tickets are immediately dispatched to fresh implementers.
6. **Finalize**:
   - Once all tickets land on `feat/<feature-name>`, run the full test suite, linter, and typecheck.
   - Run a self-review pass with [`code-review`](../code-review/SKILL.md).
   - Ensure `.worktrees/` is empty and pruned:
     ```bash
     git worktree list
     ```

---

## Completion Criteria

**Done when:**
- [ ] All requirements and acceptance criteria are implemented.
- [ ] Tests verify behavior through public seams with zero regressions.
- [ ] Typecheck and lint pass with zero errors.
- [ ] Code review passes with zero unresolved violations.
- [ ] All worktrees under `.worktrees/` are removed and pruned.
- [ ] Changes are cleanly merged or committed to the target branch.
