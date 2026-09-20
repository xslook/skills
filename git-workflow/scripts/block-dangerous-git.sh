#!/bin/bash
# Intercepts and blocks dangerous git commands before execution.
# Supports both JSON tool payloads (PreToolUse hooks) and plain command strings.

if [ "$ALLOW_DANGEROUS_GIT" = "1" ] || [ "$ALLOW_DANGEROUS_GIT" = "true" ]; then
  exit 0
fi

INPUT=$(cat)

# Extract command from JSON if jq is available and input is JSON, else fallback to raw input
if command -v jq >/dev/null 2>&1 && echo "$INPUT" | jq -e . >/dev/null 2>&1; then
  COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // .command // empty')
else
  COMMAND="$INPUT"
fi

if [ -z "$COMMAND" ]; then
  COMMAND="$INPUT"
fi

DANGEROUS_PATTERNS=(
  "git push"
  "git reset --hard"
  "git clean -fd"
  "git clean -f"
  "git clean -xdf"
  "git branch -D"
  "git checkout \."
  "git restore \."
  "push --force"
  "push -f"
  "reset --hard"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. You do not have authority to execute this destructive git command." >&2
    exit 2
  fi
done

exit 0
