---
name: spec
description: Transform discussions into actionable specifications, tracer-bullet ticket graphs with blocking edges, or async discovery questionnaires.
argument-hint: "Spec topic, ticket breakdown request, or questionnaire target"
---

# Spec & Planning

Synthesize conversations, designs, or feature requests into high-fidelity specifications, dependency-tracked tracer-bullet tickets, or async discovery questionnaires.

---

## 1. Authoring a Specification

Synthesize conversation context and codebase understanding into a definitive specification. **Do not re-interview the user; synthesize what has already been agreed.**

### Process
1. Check `CONTEXT.md` for domain vocabulary and respect ADRs in `docs/adr/`.
2. Propose testing seams at the highest viable public interface.
3. Write the spec using this template:

```markdown
# Spec: <Feature Title>

## Problem Statement
The problem from the user's perspective.

## Solution
The solution from the user's perspective.

## User Stories
Extensive, numbered list covering all aspects of the capability:
1. As an <actor>, I want <feature>, so that <benefit>.

## Implementation Decisions
- Modules to build or modify
- Public interface contracts
- Schema changes and migrations
- Architectural decisions (reference ADRs)
*(Avoid fragile line numbers or transient snippets; inline code only if derived from a prototype).*

## Testing Decisions
- Confirmed public seams under test
- Module test coverage expectations
- Prior art in the codebase

## Out of Scope
Explicitly excluded functionality.
```

Publish to the project issue tracker or save to `docs/specs/<feature-slug>.md`.

---

## 2. Tracer-Bullet Ticket Breakdown

Break a spec or plan into a **task graph** of tracer-bullet vertical slices.

### Vertical Slice Rules
- Each slice cuts a narrow but **complete vertical path** through every layer (schema, logic, API, tests).
- A completed slice is independently verifiable and testable.
- Each slice is sized to fit within a single fresh context window.
- **Prefactoring** is isolated as the first ticket.
- **Wide refactors** (schema renames, major symbol changes) use **expand-contract**: expand old+new -> migrate callers in batches -> contract/delete old.

### Declaring Blocking Edges
Every ticket declares its **blocking edges** (which tickets gate it).
- Tickets with no blockers form the initial **frontier** ready for immediate work.
- Tickets declare blockers, never arbitrary sequential order.

### Publishing Tickets
- **Local Markdown Tracker**: Write to `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered in dependency order.
- **Issue Tracker (GitHub / Linear / GitLab)**: Publish one issue per ticket with native blocking links or "Blocked by" references. Apply `ready-for-agent` label.

```markdown
# <NN>: <Ticket Title>

**What to build:** End-to-end behavior from user perspective.
**Blocked by:** <Tickets that gate this one, or "None (can start immediately)">
**Status:** ready-for-agent

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

---

## 3. Discovery Questionnaire

When progress is blocked not by code or your head, but by knowledge in **someone else's head** (stakeholder, client, external team):

1. **Grill the send, not the subject**:
   - Who is it going to? (Role, relationship, context level)
   - What do you need back? (Specific decisions or facts required to proceed)
2. **Author the questionnaire** to target the **gap** between what they know and what you need:
   - Order questions most-important-first.
   - Explain *Why this matters* for sensitive or ambiguous questions.
   - Save to `docs/questionnaires/<slug>.md` or `questionnaire-<slug>.md`.

```markdown
# Questionnaire: <Topic Title>

**From:** <User>, **To:** <Recipient>, **Purpose:** <Decision riding on this>

## Context
<1-paragraph briefing orienting the recipient.>

## <Theme 1>
### <Specific Question>
_Why this matters: <Impact on the build>_
> [Response space]
```

---

## Completion Criteria

**Done when:**
- [ ] The specification is complete, covers public seams, and is written to disk or the tracker.
- [ ] The ticket graph is split into verified tracer bullets with explicit blocking edges.
- [ ] The user reviews and approves the granularity and dependency graph.
