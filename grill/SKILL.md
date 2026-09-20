---
name: grill
description: Relentless interview engine to stress-test ideas, plans, architectures, or workflow specs. Supports stateless in-chat mode, repo-backed mode with ADR/CONTEXT.md generation, workflow loop mode, and communication reset.
argument-hint: "What would you like to grill or stress-test?"
---

# Grill

A relentless, structured interview discipline to sharpen thinking, eliminate hidden assumptions, and map decisions before execution.

---

## The Grilling Discipline

1. **Map the Design Tree**:
   Every topic has core decisions that branch into downstream sub-decisions.
   - The **frontier** is every decision whose prerequisites are already settled.
   - Never ask questions whose answers depend on open questions from the current round.

2. **Work in Rounds**:
   Ask the entire frontier in one single message per round:
   - Number each question clearly (`Q1`, `Q2`, ...).
   - Provide your **recommended answer** with a 1-line rationale so the user can accept in a word or redirect.
   - **Wait** for the user to respond before presenting the next round.

3. **Facts vs Decisions**:
   - **Facts are the agent's job**: Look up code, configuration, filesystem state, or documentation using tools/subagents. Never ask the user for facts you can look up yourself.
   - **Decisions are the user's job**: Present trade-offs, state your recommendation, and let the user decide.

```markdown
### Grilling Round <N>

❓ **Q1 — <Question Title>**: <Decision context, trade-offs, or multiple choices>

➡️ **Recommended**: <Your recommended answer and rationale>

---

❓ **Q2 — <Question Title>**: <Decision context, trade-offs, or multiple choices>

➡️ **Recommended**: <Your recommended answer and rationale>
```

---

## Operating Modes

Detect or ask the user which mode fits their context:

### Mode A: Stateless Grilling (In-Chat Idea Sharpening)

**Use when:** Brainstorming, working outside a repository, reviewing prose/strategy, or when the user explicitly requests an in-chat interview without creating files.

- **Process:**
  1. Map the initial scope and formulate the first round of frontier questions.
  2. Iterate through rounds until all branches of the design tree are settled.
  3. Close with a **Sharpened Brief** in chat: Core Vision, Settled Decisions, Accepted Trade-offs, and Immediate Next Steps.
- **Rule:** Zero disk artifacts (`CONTEXT.md`, ADRs, or scratch files are NOT created).

### Mode B: Repo-Backed Grilling (Architecture & Features)

**Use when:** Designing a feature, subsystem, or refactor within a project repository where decisions and domain terms must be preserved for future sessions.

- **Process:**
  1. **Orient:** Read `CONTEXT.md` / `CONTEXT-MAP.md` and `docs/adr/` to ground domain language and past decisions.
  2. **Interleave Grilling & Documentation:** As decisions settle inline:
     - **Domain Glossary (`CONTEXT.md`)**: When a domain concept is clarified or disambiguated, update or lazily create `CONTEXT.md` immediately.
     - **Architecture Decisions (`docs/adr/NNNN-<slug>.md`)**: When a foundational, structural, or hard-to-reverse architectural decision lands, draft an ADR.
     - **Contradiction Checking**: Flag any direction that contradicts existing ADRs or glossary terms.
  3. **Wrap-up:** Summarize the settled plan, link newly created/updated ADRs, and point to implementation (`/spec` or `/implement`).

### Mode C: Workflow Loops Grilling

**Use when:** Specifying recurring personal or team workflows (e.g. daily triage, release process, content generation).

- **The Loop Lens:** View life and work as recurring loops within loops to discover predictable activities worth delegating.
- **Vocabulary:**
  - **Trigger:** Event-driven (e.g. new issue) or schedule-driven (e.g. daily 9am).
  - **Checkpoint:** Human-in-the-loop verification gate. "Push right" to defer checkpoints as far as possible.
  - **Brief:** Decision-ready summary presented at checkpoints, never raw drafts.
- **Artifacts:**
  - `docs/workflows/<name>.md`: One spec per workflow, complete when an implementer agent could run it without asking a single question.
  - `NOTES.md`: Context notes on tools, channels, and terminology.

---

## Emergency Protocol: Communication Reset ("Wait, What?")

If the user expresses confusion, says "wait what", or if an explanation fails to land:

1. **Halt immediately:** Do not defend or repeat the previous paragraphs. Acknowledge the fog: *"Let's step back and reset."*
2. **Diagnose the failure:** Jargon overload, skipped steps, altitude mismatch, or conflicting terminology.
3. **Re-anchor:** Consult `CONTEXT.md` for agreed canonical terms.
4. **Re-pitch using ASD-STE100 / Plain English:**
   - Keep sentences under 20 words.
   - Use active voice with explicit actors.
   - Use this structure:
     - **What We Are Doing**: 1–2 sentences on the immediate objective.
     - **The Core Point**: The single central decision stated without jargon.
     - **Concrete Example**: A tangible worked scenario or before/after comparison.
     - **Why This Matters**: Direct impact on the work.
5. **Check alignment:** *"Does this framing make sense, or is there a specific part that feels off?"*

---

## Completion Criteria

**Done when:**
- [ ] Every branch of the design tree has been visited and settled (the frontier is empty).
- [ ] No decisions are left silently assumed.
- [ ] Mode-specific deliverables are verified:
  - Mode A: User confirms the final Sharpened Brief in chat.
  - Mode B: `CONTEXT.md` and new ADRs in `docs/adr/` are written and validated.
  - Mode C: `docs/workflows/<name>.md` is complete and self-contained.
