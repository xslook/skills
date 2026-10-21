#!/usr/bin/env bash
# block-dangerous-git.sh — PreToolUse guard for destructive git commands.
#
# Input (stdin) is auto-detected:
#   Antigravity : {"toolCall":{"name":"run_command","args":{"CommandLine":"..."}}}
#   Claude Code : {"tool_input":{"command":"..."}}
#   Plain text  : git push --force origin main
#
# Output:
#   Antigravity : JSON decision on stdout, always exit 0.
#                 Dangerous -> {"decision":"force_ask"} (human must approve every time)
#                 Otherwise -> {"decision":"ask"}       (normal permission flow / cache)
#   Claude Code / plain : exit 2 with reason on stderr when dangerous, exit 0 otherwise.
#
# Override: ALLOW_DANGEROUS_GIT=1 (only for human-confirmed operations).
# Requires: bash 3.2+; jq recommended (falls back to scanning raw input).

set -uo pipefail

INPUT=$(cat)
MODE=plain
COMMAND=$INPUT

if command -v jq >/dev/null 2>&1 && jq -e 'type == "object"' >/dev/null 2>&1 <<<"$INPUT"; then
  if jq -e 'has("toolCall")' >/dev/null 2>&1 <<<"$INPUT"; then
    MODE=antigravity
    COMMAND=$(jq -r '.toolCall.args.CommandLine // .toolCall.args.command // empty' <<<"$INPUT")
  else
    MODE=claude
    COMMAND=$(jq -r '.tool_input.command // .command // empty' <<<"$INPUT")
  fi
elif [[ $INPUT == \{* ]]; then
  # JSON but no jq: scan the raw payload (conservative, may over-match).
  if [[ $INPUT == *'"toolCall"'* ]]; then MODE=antigravity; else MODE=claude; fi
fi

pass() {
  [[ $MODE == antigravity ]] && printf '{"decision":"ask"}\n'
  exit 0
}

block() {
  local reason="BLOCKED destructive git command ($1). Ask the user for explicit confirmation before running it."
  if [[ $MODE == antigravity ]]; then
    if command -v jq >/dev/null 2>&1; then
      jq -nc --arg r "$reason" '{decision:"force_ask", reason:$r}'
    else
      printf '{"decision":"force_ask","reason":"%s"}\n' "$reason"
    fi
    exit 0
  fi
  printf '%s\nCommand: %s\n' "$reason" "$COMMAND" >&2
  exit 2
}

[[ ${ALLOW_DANGEROUS_GIT:-} == 1 || ${ALLOW_DANGEROUS_GIT:-} == true ]] && pass
[[ -z $COMMAND ]] && pass

# Flatten newlines so multi-line scripts are scanned as one string.
COMMAND=${COMMAND//$'\n'/ }
# Drop message arguments (-m "...", --message='...') so prose inside commit or
# tag messages is not mistaken for a command. Other quoted strings are kept,
# so `bash -c "git push"` is still caught.
COMMAND=$(printf '%s' "$COMMAND" | sed -E \
  -e "s/(-m|--message)(=|[[:space:]]+)\"([^\"\\\\]|\\\\.)*\"/\1 MSG/g" \
  -e "s/(-m|--message)(=|[[:space:]]+)'[^']*'/\1 MSG/g")

# `git` preceded by start/separator, followed by optional global options
# (-C <path>, -c <k=v>, --no-pager, --git-dir=<x>, ...), then the subcommand.
S='[[:space:]]'
GIT="(^|[;&|(\`\"']|$S)git($S+(-[Cc]$S+[^[:space:]]+|--[a-z-]+(=[^[:space:]]+)?))*$S+"
END="($S|$|[;&|)\"'])"

PATTERNS=(
  "${GIT}push${END}"
  "${GIT}reset($S.*)?$S--hard${END}"
  "${GIT}clean($S.*)?$S(-[a-zA-Z]*f[a-zA-Z]*|--force)${END}"
  "${GIT}branch($S.*)?$S(-[a-zA-Z]*D[a-zA-Z]*|--delete$S.*--force|--force$S.*--delete)${END}"
  "${GIT}(checkout|restore)($S.*)?$S(--$S+)?(\.|:/)${END}"
  "${GIT}(checkout|switch)($S.*)?$S(-f|--force|--discard-changes)${END}"
  "${GIT}stash$S+(drop|clear)${END}"
  "${GIT}reflog$S+(expire|delete)${END}"
  "${GIT}gc($S.*)?$S--prune"
  "${GIT}filter-(branch|repo)${END}"
  "${GIT}update-ref($S.*)?$S-d${END}"
  "${GIT}worktree$S+remove($S.*)?$S(-f|--force)${END}"
)
REASONS=(
  "push publishes or overwrites remote history"
  "reset --hard discards uncommitted work"
  "clean -f permanently deletes untracked files"
  "branch -D deletes unmerged branches"
  "checkout/restore of the whole tree discards uncommitted work"
  "forced checkout/switch discards uncommitted work"
  "stash drop/clear deletes stashed work"
  "reflog expire/delete removes the recovery safety net"
  "gc --prune permanently deletes unreachable commits"
  "filter-branch/filter-repo rewrites all history"
  "update-ref -d deletes a ref"
  "worktree remove --force discards uncommitted work in the worktree"
)

for i in "${!PATTERNS[@]}"; do
  if [[ $COMMAND =~ ${PATTERNS[$i]} ]]; then
    block "${REASONS[$i]}"
  fi
done

pass
