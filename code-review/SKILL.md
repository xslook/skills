---
name: code-review
description: "Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to \"review since X\"."
---

Two-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards**: does the code conform to this repo's documented coding standards, security baselines, performance constraints, and maintainability smells?
- **Spec**: does the code faithfully implement the originating issue / spec without omissions or scope creep?

Both axes run as **parallel sub-agents** so they don't pollute each other's context, then this skill aggregates their findings.

The issue tracker should have been provided to you. If `docs/agents/issue-tracker.md` is missing, tell the user to run `/setup`.

## Process

### 1. Pin the fixed point

Whatever the user said is the fixed point (a commit SHA, branch name, tag, `main`, `HEAD~5`, etc.). If they didn't specify one, ask for it.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, so the comparison is against the merge-base). Also note the list of commits via `git log <fixed-point>..HEAD --oneline`.

Before going further, confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. A bad ref or empty diff should fail here, not inside two parallel sub-agents.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. Issue references in the commit messages (`#123`, `Closes #45`, GitLab `!67`, etc.), fetched via the workflow in `docs/agents/issue-tracker.md` or git issue tracker integration.
2. A path the user passed as an argument.
3. A spec file under `docs/`, `specs/`, or `.scratch/` matching the branch name or feature.
4. If nothing is found, ask the user where the spec is. If they say there isn't one, the **Spec** sub-agent will skip and report "no spec available".

### 3. Identify the standards sources & checklists

Anything in the repo that documents how code should be written, such as `CODING_STANDARDS.md` or `CONTRIBUTING.md`.

On top of whatever the repo documents, the Standards axis always evaluates against:

#### A. Security Audit Baseline
- **Injection & Input Validation**: SQL injection, command injection, XSS, unsafe deserialization, path traversal, SSRF.
- **Auth & Access Control**: Broken authentication, missing authorization checks on sensitive endpoints, improper role checks.
- **Secrets & Data Exposure**: Plaintext API keys, passwords, tokens, or PII exposed in code or logging.

#### B. Performance Audit Baseline
- **Database & I/O**: N+1 query patterns, missing indexes on filtered columns, unbounded queries lacking `LIMIT` or pagination.
- **Compute & Memory**: Algorithmic complexity ($O(n^2)$ in hot paths), unclosed resources (streams, connections), unnecessary large allocations in loops.
- **Concurrency**: Missing locks/synchronization, race conditions, deadlocks.

#### C. Fowler Smell Baseline (_Refactoring_, ch. 3)
A fixed set that applies even when a repo documents nothing:
- **The repo overrides.** A documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation. Skip anything tooling already enforces (linter/formatter).

Smells to check:
- **Mysterious Name**: function, variable, or type whose name doesn't reveal what it does or holds. → rename it; if no honest name comes, the design's murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file in the change. → extract the shared shape, call it from both.
- **Feature Envy**: a method that reaches into another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together (a type wanting to be born). → bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain concept that deserves its own type. → give the concept its own small type.
- **Repeated Switches**: the same `switch`/`if`-cascade on the same type recurs across the change. → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery**: one logical change forces scattered edits across many files in the diff. → gather what changes together into one module.
- **Divergent Change**: one file or module is edited for several unrelated reasons. → split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks added for needs the spec doesn't have. → delete it; inline back until a real need shows.
- **Message Chains**: long `a.b().c().d()` navigation the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly just delegates onward. → cut it, call the real target direct.
- **Refused Bequest**: a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance, use composition.

### 4. Spawn both sub-agents in parallel

**Standards sub-agent prompt** should include:

- The full diff command and commit list.
- The list of standards-source files found in step 3, **plus the Security, Performance, and Fowler smell baselines** from step 3 pasted in full.
- The brief: "Report:
  (a) Hard violations: documented repo standards breaches, security flaws (injection, auth, secrets), or performance bugs (N+1 queries, unbounded loops).
  (b) Judgement calls: baseline Fowler smells and maintainability suggestions.
  Structure your findings with severity (🔴 Critical, 🟡 Warning, 💡 Suggestion), quoting file path and line numbers. Skip anything tooling (linters/formatters) enforces. Under 500 words."

**Spec sub-agent prompt** should include:

- The diff command and commit list.
- The path or fetched contents of the spec.
- The brief: "Report:
  (a) requirements the spec asked for that are missing or partial;
  (b) behaviour in the diff that wasn't asked for (scope creep);
  (c) requirements that look implemented but where the implementation looks wrong or has missing edge cases.
  Quote the spec line for each finding. Under 500 words."

If the spec is missing, skip the Spec sub-agent and note this in the final report.

### 5. Aggregate

Present the findings clearly, maintaining the separate axes:

```markdown
## Code Review: [Diff range or branch]

### Summary
[1-2 sentence overview of the changes, intent, and overall health]

### Spec Conformance
| # | Requirement | Status | Details |
|---|-------------|--------|---------|
| 1 | [Spec requirement] | Missing / Partial / Implemented / Scope Creep | [Explanation & spec quote] |

### Standards & Quality Findings
#### Critical Issues
| # | File:Line | Issue | Category | Severity |
|---|-----------|-------|----------|----------|
| 1 | `path/to/file.ts:42` | [Description of issue] | Security / Performance / Standard | 🔴 Critical |

#### Suggestions & Smells
| # | File:Line | Suggestion | Category |
|---|-----------|------------|----------|
| 1 | `path/to/file.ts:88` | [Description of suggestion] | Maintainability / Fowler Smell |

### What Looks Good
- [Specific positive architectural or code patterns observed]

### Verdict
- **Spec**: Pass / Needs Work / Scope Creep Detected / No Spec Found
- **Standards**: Approve / Request Changes / Needs Discussion
```

## Why two axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions or introduces security bugs → **Spec pass, Standards fail.**

Reporting them separately stops one axis from masking the other.
