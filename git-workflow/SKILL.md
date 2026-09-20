---
name: git-workflow
description: "Comprehensive Git lifecycle operations: conventional commits, feature branch syncing, isolated worktrees (.worktrees/), 3-way conflict resolution (diff3), history rewriting, disaster recovery (reflog), session handoffs, pre-deploy verification, and destructive command guardrails."
argument-hint: "Operation: 'commit', 'sync', 'worktree', 'resolve-conflicts', 'undo', 'handoff', 'deploy', or 'guardrails'"
---

# Git Workflow & Release Operations

A comprehensive, production-grade engineering discipline for git lifecycle management, branch workflows, worktree isolation, conflict resolution, history cleanup, disaster recovery, and release readiness.

---

## 1. Commit & Branching Discipline

Clean history is communication for your team and future agents.

### Conventional Commits Standard
Format: `<type>(<optional scope>): <imperative description> [#issue]`
- `feat`: New feature or user-facing capability.
- `fix`: Bug fix for an existing behavior.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `perf`: Performance optimization.
- `test`: Adding or refactoring automated tests.
- `docs`: Documentation updates only.
- `chore`: Build scripts, CI configs, package manager updates.

**Rules**:
1. **Imperative mood**: "add user avatar upload" (not "added" or "adds").
2. **First line $\le 72$ chars**: Concise summary. Follow with an optional body for non-obvious context.
3. **Atomic commits**: One logical conceptual change per commit. Avoid grouping unrelated fixes. Use `git add -p` to stage specific hunks interactively when files contain mixed changes.

### Branch Syncing & Hygiene
Always pull upstream changes onto your feature branch without creating merge bubbles:
```bash
# Fetch latest references
git fetch origin

# Rebase feature branch cleanly on top of main
git rebase origin/main

# If temporary uncommitted changes exist, stash them first:
git stash push -m "wip: save local edits before rebase"
git rebase origin/main
git stash pop
```

---

## 2. Isolated Worktree Environments (`.worktrees/`)

Use git worktrees to inspect branches, review PRs, run subagents, or apply emergency hotfixes without disturbing your main working directory or stashing dirty files.

### Working Tree Rules
- **Encapsulated path**: Always keep worktrees in `.worktrees/<name>` at the repo root.
- **Gitignore quarantine**: Ensure `.worktrees/` is in `.gitignore` before creating worktrees:
  ```bash
  grep -qxF '.worktrees/' .gitignore 2>/dev/null || echo '.worktrees/' >> .gitignore
  ```

### Lifecycle Commands
```bash
# 1. Create a worktree on a new branch:
git worktree add .worktrees/<name> -b <new-branch> [base-ref]

# 2. Check out an existing remote PR or branch for inspection:
git worktree add .worktrees/review-pr-42 origin/feat-login

# 3. List active worktrees:
git worktree list

# 4. Safely remove and prune when finished:
git worktree remove .worktrees/<name>
git worktree prune
```

---

## 3. Resolving Merge & Rebase Conflicts

Resolve in-progress git conflicts hunk-by-hunk by tracing intent to primary sources, never by `--abort`ing prematurely or guessing lines.

### Process
1. **Diagnose Conflict State**:
   ```bash
   git status
   # Check commit logs from both branches since the merge-base:
   git log $(git merge-base HEAD MERGE_HEAD)..HEAD --oneline
   git log $(git merge-base HEAD MERGE_HEAD)..MERGE_HEAD --oneline
   ```
2. **Inspect with Three-Way Diffs (`diff3`)**:
   ```bash
   git checkout --conflict=diff3 <file>
   ```
   Inspect the three distinct sections:
   - `<<<<<<< HEAD`: Our current change.
   - `||||||| <ancestor>`: Common ancestor before both changes (shows original baseline).
   - `>>>>>>> <branch>`: Incoming change.
3. **Resolve by Intent**:
   - Trace why both sides changed the same lines and combine both intents.
   - **Lockfiles** (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `Cargo.lock`): Never manually resolve conflict markers in lockfiles. Check out the baseline or target, then regenerate cleanly via the package manager:
     ```bash
     git checkout --ours package-lock.json
     npm install
     ```
4. **Verify Zero Residual Markers**:
   ```bash
   git diff --check
   git grep -E '^(<{7}|={7}|>{7})'
   ```
5. **Run Automated Checks**: Verify tests and typechecks pass before committing:
   ```bash
   git add <resolved-files>
   git commit   # or git rebase --continue
   ```

---

## 4. History Cleanup & Disaster Recovery ("Oh Shit, Git!")

Tools for polishing commit history and safely recovering from accidental deletions or wrong commands.

### A. History Polishing (Before PR)
Clean up exploratory or noisy commits (`fix typo`, `wip`, `oops`) into clean logical commits:
```bash
# Interactively rebase the last N commits
git rebase -i HEAD~3
# Commands:
#   pick   = keep commit
#   reword = edit commit message
#   squash = meld into previous commit and combine messages
#   fixup  = meld into previous commit discarding this message
```

### B. Undoing Mistakes Safely
- **Undo last commit, keep changes staged in index**:
  ```bash
  git reset --soft HEAD~1
  ```
- **Undo last commit, unstage changes (keep edits in working tree)**:
  ```bash
  git reset HEAD~1
  ```
- **Safely revert a commit that has already been pushed (creates an inverted commit)**:
  ```bash
  git revert <commit-sha>
  ```
- **Discard uncommitted changes in a specific file**:
  ```bash
  git restore <path/to/file>
  ```

### C. Reflog Disaster Recovery
If you accidentally deleted a branch, lost commits after a rebase, or performed an unwanted reset:
```bash
# 1. View recent git HEAD actions with SHAs
git reflog

# 2. Find the point right before the mistake (e.g. HEAD@{2}) and branch from it:
git checkout -b recovered-work HEAD@{2}
```

---

## 5. Cross-Session & Agent Handoffs

Transfer active work from this session to a fresh session, background agent, or colleague without token degradation or dead-end clutter:

### Modes
- **Mode A: Background Agent (Immediate Autonomous Handoff)**:
  - Antigravity: Dispatch background task or `invoke_subagent` with the handoff prompt.
  - Claude Code: Run `claude --bg --name "<name>" "<handoff-summary>"`.
- **Mode B: Portable File Handoff**:
  - Save structured markdown to `.scratch/handoffs/handoff-<timestamp>.md` or `$TMPDIR/handoff-<timestamp>.md`.
  - Provide path and command to resume in chosen tool.

### Handoff Structure
```markdown
# Handoff: <Task Title>
**Goal:** <Objective>

## Current Status
- [x] Completed items
- [ ] Immediate next action

## Key Decisions & Conventions (from CONTEXT.md / ADRs)
## Relevant Files, Branch & Commits
## Critical Gotchas & Non-Obvious Findings
## Suggested Skills for Next Agent
```

---

## 6. Pre-Deployment, Tagging & Release Verification

Before deploying to staging/production or cutting a release:

### Version Tagging & Changelog
```bash
# View all commits since the last annotated tag:
git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline

# Create an annotated release tag:
git tag -a v1.2.0 -m "Release v1.2.0: add avatar upload and rate limiting"
```

### Release Readiness Checklist
```markdown
## Deploy Checklist: [Service / Release Tag]
**Target:** Production / Staging | **Commit / Tag:** `[git rev-parse --short HEAD]`

### Pre-Deploy Verification
- [ ] CI pipeline is green on the release commit (tests, linter, builds).
- [ ] PR approvals met and code review completed along Spec & Standards.
- [ ] Database migrations tested in staging; backwards compatibility verified.
- [ ] Feature flags configured in management portal.
- [ ] Secrets/environment variables provisioned in target environment.
- [ ] Rollback strategy and triggers defined before deployment starts.

### Deployment Execution
- [ ] Deploy to staging / canary environment first.
- [ ] Execute smoke tests against running staging instance.
- [ ] Deploy to production (blue/green or rolling restart).
- [ ] Monitor telemetry (error rates, p95/p99 latency) for 15 minutes.

### Explicit Rollback Triggers
Abort and execute immediate rollback if any condition triggers:
- Error rate exceeds [e.g., 0.5% or 2x baseline].
- P99 latency spikes above [e.g., 500ms].
- Core business transaction (login, payment, data ingestion) fails smoke check.
```

---

## 7. Safety Guardrails (Destructive Command Interceptor)

Block destructive git operations (`git push`, `git reset --hard`, `git clean -fd`, `git branch -D`) before an AI agent or accidental command executes them:

1. **Script**: Use [scripts/block-dangerous-git.sh](scripts/block-dangerous-git.sh).
2. **Installation Options**:
   - **Antigravity / Universal**: Configure in `hooks.json` under `PreToolUse`.
   - **Claude Code**: Add to `.claude/settings.json` under `hooks.PreToolUse`.
   - **Native Git Hook**: Copy to `.git/hooks/pre-push` to protect branches (`main`/`master`) directly.
3. **Safety Override**: Set `ALLOW_DANGEROUS_GIT=1` when human-confirmed destructive commands must run.
4. **Verification**:
   ```bash
   echo '{"tool_input":{"command":"git push origin main"}}' | ./git-workflow/scripts/block-dangerous-git.sh
   # Expected: Exits code 2 with BLOCKED message.
   ```

---

## Completion Criteria

**Done when:**
- [ ] Commits follow Conventional Commits standard with atomic scoping.
- [ ] Worktrees under `.worktrees/` are removed and pruned when operations conclude.
- [ ] Conflicts are resolved via 3-way diffs with zero residual markers and clean test passes.
- [ ] Clean rebase / history cleanup performed without losing commits (reflog verified).
- [ ] Handoff summary is written and shared without leaking secrets.
- [ ] Releases verify CI status, migration safety, and document explicit rollback triggers.
- [ ] Destructive guardrail hook is active and verified.
