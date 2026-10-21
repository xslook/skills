# Session & Agent Handoffs

Pass in-progress work to a fresh session, a background agent, or a colleague. Carry over only what the next person needs, not the whole conversation.

## 1. Capture Git State (Always Include)

```bash
git branch --show-current
git status --short
git log --oneline "@{upstream}..HEAD" 2>/dev/null || git log --oneline -n 10   # unpushed commits
git stash list
git worktree list
```

If uncommitted work must survive the handoff, commit it to the feature branch as `wip: <what>` (ask the user first) rather than leaving it only in the working tree.

## 2. Choose a Mode

- **Background agent (immediate)**: hand the summary below to the agent's own delegation mechanism (in Antigravity, `invoke_subagent` with `Workspace: "branch"` or a dedicated `.worktrees/<name>` so it doesn't touch your working tree).
- **Portable file**: write the summary to `.scratch/handoffs/handoff-<YYYYMMDD-HHMM>.md` and keep it out of commits: `grep -qxF '.scratch/' .git/info/exclude || echo '.scratch/' >> .git/info/exclude`. Tell the user the path and how to resume.

## 3. Template

```markdown
# Handoff: <Task Title>
**Goal:** <one-sentence objective>
**Branch:** `<branch>` @ `<short-sha>` | **Worktree:** `<path>` | **Pushed:** yes/no

## Status
- [x] Done items (with commit SHAs)
- [ ] **Next action:** <the single concrete next step>
- [ ] Remaining items

## Decisions & Conventions
- <decision> (reason; link to ADR / CONTEXT.md if any)

## Key Files
- `path/to/file`: why it matters

## Gotchas
- <non-obvious findings, failed approaches and why they failed>

## How to Verify
- `<test command>`: expected result

## Suggested Skills
- <skill names the next agent should load>
```

## 4. Before Sending

- [ ] No secrets, tokens, or `.env` contents in the summary.
- [ ] The next action can be done without reading the old conversation.
- [ ] Git state in the summary matches `git status` right now.
