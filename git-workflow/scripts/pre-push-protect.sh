#!/usr/bin/env bash
# pre-push-protect.sh — native git pre-push hook.
#
# Blocks, for every pushed ref:
#   - direct pushes to protected branches (default: main master)
#   - remote branch deletion
#   - non-fast-forward (force) pushes
#
# Install:  cp pre-push-protect.sh .git/hooks/pre-push && chmod +x .git/hooks/pre-push
# Config:   PROTECTED_BRANCHES="main master release"   (space-separated)
# Override: ALLOW_DANGEROUS_GIT=1 git push ...          (human-confirmed only)
#
# git passes "<local-ref> <local-sha> <remote-ref> <remote-sha>" lines on stdin.

set -uo pipefail

[[ ${ALLOW_DANGEROUS_GIT:-} == 1 || ${ALLOW_DANGEROUS_GIT:-} == true ]] && exit 0

PROTECTED=${PROTECTED_BRANCHES:-main master}
is_zero() { [[ $1 =~ ^0+$ ]]; }
fail() { printf 'pre-push BLOCKED: %s\nOverride (human-confirmed only): ALLOW_DANGEROUS_GIT=1 git push ...\n' "$1" >&2; exit 1; }

while read -r local_ref local_sha remote_ref remote_sha; do
  [[ -z ${remote_ref:-} ]] && continue
  branch=${remote_ref#refs/heads/}

  if is_zero "$local_sha"; then
    fail "deleting remote ref '$remote_ref'"
  fi

  for p in $PROTECTED; do
    [[ $branch == "$p" ]] && fail "direct push to protected branch '$branch'"
  done

  if ! is_zero "$remote_sha"; then
    if ! git cat-file -e "${remote_sha}^{commit}" 2>/dev/null; then
      fail "remote '$remote_ref' has commits not present locally; run 'git fetch' and rebase first"
    fi
    if ! git merge-base --is-ancestor "$remote_sha" "$local_sha"; then
      fail "non-fast-forward (force) push to '$remote_ref'"
    fi
  fi
done

exit 0
