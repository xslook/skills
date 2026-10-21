---
name: git-workflow
description: "Use when committing, branching, syncing/rebasing a feature branch, creating git worktrees, resolving merge/rebase/cherry-pick conflicts, cleaning up commit history, undoing mistakes or recovering lost commits (reset, revert, reflog), handing off in-progress work to another session or agent, tagging a release, or installing guardrails against destructive git commands."
argument-hint: "Operation: 'commit', 'sync', 'worktree', 'resolve-conflicts', 'undo', 'handoff', 'release', or 'guardrails'"
---

# Git Workflow & Release Operations

Safe, non-interactive git procedures for AI agents: clean commits, branch sync, worktree isolation, conflict resolution, history repair, handoffs, and releases.

---

## 0. Golden Rules (Always Apply)

1. **Inspect before acting.** Run `git status --short --branch` first. It shows in-progress merges/rebases, dirty files, and ahead/behind counts. Check `git log --oneline -n 10` to match the repo's existing commit style.
2. **Never run interactive commands.** Agents have no TTY, so an editor or prompt hangs forever.
   | Avoid | Use instead |
   | :--- | :--- |
   | `git commit` (no message) | `git commit -m "subject" -m "body"` or `git commit -F - <<'EOF' … EOF` |
   | `git rebase -i` | `GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash <base>` (see [history-and-recovery.md](./references/history-and-recovery.md#a-polish-history-before-a-pr-non-interactive)) |
   | `git rebase/merge --continue` | `GIT_EDITOR=true git rebase --continue` |
   | `git add -p` | `git add <specific paths>`; for partial files, `git diff <file> > p.patch`, edit the patch, then `git apply --cached p.patch` |
   | `git log` / `git diff` with pager | `git --no-pager log …` or `-n <N>` |
3. **Only commit, push, or rewrite when asked.** `git push`, force-pushes, tag pushes, and history rewrites need explicit user confirmation. Use `--force-with-lease`, never `--force`.
4. **Stage explicitly and review.** Use `git add <paths>`, not `git add -A` / `git add .`. Review `git diff --cached --stat` before every commit. Never commit secrets (`.env`, keys, tokens) or unrelated files.
5. **Never rewrite shared history** (`main`, `master`, `release/*`, or any branch others have pulled). On shared branches, use `git revert`.
6. **Create a safety point before risky operations**: `git branch backup/<branch>-$(date +%Y%m%d-%H%M%S)`.
7. **Repo conventions win.** Follow `CONTRIBUTING.md`, commitlint config, PR templates, and existing branch naming over the defaults below.

---

## 1. Commits

Format: `<type>(<scope>)!: <imperative summary>`. The `!` is used only for breaking changes.

| Type | Use for |
| :--- | :--- |
| `feat` / `fix` | New capability / bug fix (user-visible) |
| `refactor` / `perf` | Restructure without behavior change / speed-up |
| `test` / `docs` / `style` | Tests / docs only / formatting only |
| `build` / `ci` / `chore` | Build system & deps / CI config / other maintenance |
| `revert` | Reverting a previous commit |

- Imperative mood, no trailing period, subject ≤ 72 chars (≤ 50 preferred).
- Body explains **why**, not what. Wrap at 72.
- Footers: `BREAKING CHANGE: <description>`, `Closes #123`, `Refs: #456`, `Co-authored-by: Name <email>`.
- **Atomic**: one logical change per commit. Each commit should build and pass tests.

```bash
git add src/auth/avatar.ts src/auth/avatar.test.ts
git diff --cached --stat
git commit -F - <<'EOF'
feat(auth): add avatar upload

Store avatars in object storage instead of the DB to keep rows small.

Closes #123
EOF
```

**Verify:** `git log -1 --format='%s%n%n%b'` shows the intended message, and `git status` is clean or shows only intentionally unstaged files.

---

## 2. Branch Sync

```bash
DEFAULT=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || echo origin/main)
git fetch origin
git rebase --autostash "$DEFAULT"         # stashes, rebases, and re-applies dirty changes
```

- Conflicts → [conflict-resolution.md](./references/conflict-resolution.md).
- If the branch was already pushed, the rebase rewrites it. After user confirmation, run `git push --force-with-lease`.
- If others share the branch, use `git merge "$DEFAULT"` instead of rebasing.
- New branch names: `<type>/<short-kebab-desc>` (e.g. `feat/avatar-upload`, `fix/123-login-redirect`) unless the repo has its own convention.

**Verify:** `git status -sb` shows no "behind", and `git log --oneline "$DEFAULT"..HEAD` lists only your commits.

---

## 3. Isolated Worktrees (`.worktrees/`)

Use worktrees to review PRs, run parallel or sub-agents, or make hotfixes without touching the main working tree.

```bash
# Ignore locally without modifying the tracked .gitignore:
grep -qxF '.worktrees/' .git/info/exclude || echo '.worktrees/' >> .git/info/exclude

git worktree add .worktrees/<name> -b <new-branch> [base-ref]       # new branch
git fetch origin pull/42/head:pr-42 && git worktree add .worktrees/pr-42 pr-42   # GitHub PR
git worktree add --detach .worktrees/inspect origin/feat-login       # read-only inspection
git worktree list
```

- A branch can only be checked out in **one** worktree at a time.
- A new worktree has no `node_modules`, `.venv`, build output, or untracked `.env`. Install and copy what you need before running anything.
- **Cleanup:** `git -C .worktrees/<name> status --short` must be empty (otherwise ask the user), then `git worktree remove .worktrees/<name> && git worktree prune`. Never use `--force` without user confirmation.

---

## 4. Conflicts, Undo & Recovery

| Task | Key point | Reference |
| :--- | :--- | :--- |
| Resolve conflicts | During a **rebase**, `--ours` = upstream and `--theirs` = your commit (the reverse of a merge). Never hand-edit lockfiles; regenerate them. | [conflict-resolution.md](./references/conflict-resolution.md) |
| Polish history | Use `commit --fixup` + `GIT_SEQUENCE_EDITOR=: rebase -i --autosquash`, or `reset --soft` + recommit. | [history-and-recovery.md](./references/history-and-recovery.md#a-polish-history-before-a-pr-non-interactive) |
| Undo a mistake | Pushed → `git revert`. Local → `git reset --soft`. Check whether the command is destructive first. | [history-and-recovery.md](./references/history-and-recovery.md#b-undo-decision-table) |
| Recover lost commits/stash | `git reflog` → `git branch recovered/<x> <sha>`. Dropped stash → `git fsck --unreachable`. | [history-and-recovery.md](./references/history-and-recovery.md#c-recovering-lost-work) |

---

## 5. Handoffs, Releases & Guardrails

| Task | Reference |
| :--- | :--- |
| Hand off in-progress work (git state capture, template, secret check) | [handoff.md](./references/handoff.md) |
| Tag a release (SemVer from commits, changelog, deploy checklist, rollback triggers) | [release-and-deploy.md](./references/release-and-deploy.md) |
| Block destructive commands (agent PreToolUse hook + native pre-push hook) | [guardrails.md](./references/guardrails.md) |

Scripts:
- [block-dangerous-git.sh](./scripts/block-dangerous-git.sh): PreToolUse guard (Antigravity / Claude Code / plain text input).
- [pre-push-protect.sh](./scripts/pre-push-protect.sh): native `pre-push` hook (protected branches, force pushes, deletions).
- [test-guardrails.sh](./scripts/test-guardrails.sh): regression tests for the guard.

---

## Completion Checklist

- [ ] `git status` is clean, or the remaining changes are intentional and explained to the user.
- [ ] Commits are atomic, follow the repo's convention, and contain no secrets or unrelated files.
- [ ] No push, force-push, tag push, or shared-history rewrite happened without explicit user confirmation.
- [ ] Conflicts are resolved with zero residual markers (`git diff --check`) and tests pass.
- [ ] Temporary worktrees are removed and pruned. Backup branches are reported to the user (not silently deleted).
- [ ] Any recovery was verified by diffing against the expected state.
