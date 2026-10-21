#!/usr/bin/env bash
# test-guardrails.sh — regression tests for block-dangerous-git.sh.
# Usage: ./scripts/test-guardrails.sh   (exit 0 = all passed)

set -uo pipefail
cd "$(dirname "$0")"
GUARD=./block-dangerous-git.sh
fails=0

# expect <block|pass> <command>
expect() {
  local want=$1 cmd=$2 got
  printf '%s' "$cmd" | env -u ALLOW_DANGEROUS_GIT "$GUARD" >/dev/null 2>&1
  [[ $? -eq 2 ]] && got=block || got=pass
  if [[ $got != "$want" ]]; then
    printf 'FAIL  want=%-5s got=%-5s  %s\n' "$want" "$got" "$cmd"; fails=$((fails + 1))
  fi
}

# --- must block ---
expect block 'git push'
expect block 'git push origin main'
expect block 'git push --force-with-lease'
expect block 'git -C ../other push -f'
expect block 'git --no-pager push origin HEAD'
expect block 'npm test && git push'
expect block 'git reset --hard'
expect block 'git reset --hard origin/main'
expect block 'git reset -q --hard HEAD~1'
expect block 'git clean -fd'
expect block 'git clean -xdf'
expect block 'git clean --force'
expect block 'git branch -D feature'
expect block 'git branch --delete --force feature'
expect block 'git checkout .'
expect block 'git checkout -- .'
expect block 'git restore .'
expect block 'git restore --staged --worktree :/'
expect block 'git checkout -f main'
expect block 'git switch --discard-changes main'
expect block 'git stash drop'
expect block 'git stash clear'
expect block 'git reflog expire --expire=now --all'
expect block 'git gc --prune=now'
expect block 'git filter-branch --tree-filter x HEAD'
expect block 'git filter-repo --path secrets.txt --invert-paths'
expect block 'git update-ref -d refs/heads/x'
expect block 'git worktree remove --force .worktrees/x'
expect block 'bash -c "git push origin main"'
expect block 'git commit -m "wip" && git push'
expect block "git commit -m 'it'\''s done' && git reset --hard"

# --- must pass ---
expect pass 'git status'
expect pass 'git log --oneline -n 10'
expect pass 'git commit -m "docs: explain why we never git push on fridays"'
expect pass 'git reset --soft HEAD~1'
expect pass 'git reset HEAD~1'
expect pass 'git clean -nd'
expect pass 'git branch -d merged-feature'
expect pass 'git checkout .eslintrc'
expect pass 'git checkout ./src/app.ts'
expect pass 'git checkout -b feat/login'
expect pass 'git restore src/app.ts'
expect pass 'git stash push -m wip'
expect pass 'git stash pop'
expect pass 'git worktree remove .worktrees/x'
expect pass 'git pushd'
expect pass 'echo legit-push'
expect pass 'ls -la'

# --- payload formats ---
out=$(printf '%s' '{"toolCall":{"name":"run_command","args":{"CommandLine":"git push origin main"}}}' | "$GUARD")
[[ $out == *force_ask* ]] || { echo "FAIL  antigravity dangerous -> $out"; fails=$((fails + 1)); }
out=$(printf '%s' '{"toolCall":{"name":"run_command","args":{"CommandLine":"git status"}}}' | "$GUARD")
[[ $out == '{"decision":"ask"}' ]] || { echo "FAIL  antigravity safe -> $out"; fails=$((fails + 1)); }
printf '%s' '{"tool_input":{"command":"git reset --hard"}}' | "$GUARD" 2>/dev/null
[[ $? -eq 2 ]] || { echo "FAIL  claude dangerous"; fails=$((fails + 1)); }
printf '%s' '{"tool_input":{"command":"git diff"}}' | "$GUARD"
[[ $? -eq 0 ]] || { echo "FAIL  claude safe"; fails=$((fails + 1)); }
printf '%s' 'git push' | ALLOW_DANGEROUS_GIT=1 "$GUARD"
[[ $? -eq 0 ]] || { echo "FAIL  override"; fails=$((fails + 1)); }

if [[ $fails -eq 0 ]]; then echo "All guardrail tests passed."; else echo "$fails test(s) failed."; exit 1; fi
