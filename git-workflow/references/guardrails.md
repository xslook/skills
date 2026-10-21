# Destructive Command Guardrails

Two layers. Install both for full coverage.

| Layer | Script | Catches | Misses |
| :--- | :--- | :--- | :--- |
| Agent hook (PreToolUse) | [block-dangerous-git.sh](../scripts/block-dangerous-git.sh) | Agent shell commands: push, `reset --hard`, `clean -f`, `branch -D`, `checkout .`, `stash drop/clear`, `reflog expire`, `gc --prune`, `filter-branch/repo`, `update-ref -d`, `worktree remove --force` | Humans typing in a terminal; obfuscated commands (aliases, `eval`, scripts) |
| Native git hook | [pre-push-protect.sh](../scripts/pre-push-protect.sh) | Any push (human or agent) to protected branches, remote branch deletion, non-fast-forward (force) pushes | Local-only destruction (`reset --hard`, `clean`) |

A pattern-matching guard is a seatbelt, not a sandbox. It stops accidents, not someone deliberately working around it.

## Install: Antigravity

`.agents/hooks.json` (workspace) or `~/.gemini/config/hooks.json` (global). The command runs from the directory that contains `hooks.json`, so use a path relative to it or an absolute path:

```json
{
  "git-guard": {
    "PreToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          { "type": "command", "command": "./skills/git-workflow/scripts/block-dangerous-git.sh", "timeout": 5 }
        ]
      }
    ]
  }
}
```

Dangerous commands return `{"decision":"force_ask"}`, so the user is prompted every time, even if the command was cached as "Always Allow". Every other command returns `{"decision":"ask"}`, which defers to the normal permission flow.

## Install: Claude Code

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/path/to/git-workflow/scripts/block-dangerous-git.sh" }
        ]
      }
    ]
  }
}
```

A block exits with code 2 and the reason goes to stderr, which is shown to the agent.

## Install: Native pre-push Hook

```bash
cp git-workflow/scripts/pre-push-protect.sh .git/hooks/pre-push
chmod +x .git/hooks/pre-push
# Optional: customise protected branches (space-separated)
export PROTECTED_BRANCHES="main master release"
```

If the repo already uses a hook manager (husky, lefthook, pre-commit), register the script there instead of overwriting `.git/hooks/pre-push`.

## Override

`ALLOW_DANGEROUS_GIT=1` bypasses both scripts. Use it **only** after the user explicitly confirms the specific command, e.g. `ALLOW_DANGEROUS_GIT=1 git push --force-with-lease`. An agent must never set it on its own initiative.

## Verify

```bash
git-workflow/scripts/test-guardrails.sh                     # full regression suite
echo 'git push origin main' | git-workflow/scripts/block-dangerous-git.sh; echo "exit=$?"   # expect exit=2
```

Requires `bash` and `jq` (without `jq`, JSON payloads are scanned as raw text, which errs toward blocking).
