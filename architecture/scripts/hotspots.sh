#!/usr/bin/env bash
# hotspots.sh: rank files by git churn and show files that change together.
#
# Usage:
#   scripts/hotspots.sh [--since "6 months ago"] [--top 30] [--file <path>] [--repo <dir>]
#
#   --since  Time window passed to `git log --since` (default: "6 months ago")
#   --top    Number of rows to print (default: 30)
#   --file   Also list the files most often committed together with <path> (hidden coupling)
#   --repo   Repository directory (default: current directory)
#
# Output: plain text, "<count> <path>" per line, sorted descending.
# Requires: git, POSIX sort/uniq/head. Read-only: it never modifies the repo.
set -euo pipefail

since="6 months ago"
top=30
file=""
repo="."

while [[ $# -gt 0 ]]; do
  case "$1" in
    --since) since="${2:?--since needs a value}"; shift 2 ;;
    --top)   top="${2:?--top needs a value}"; shift 2 ;;
    --file)  file="${2:?--file needs a value}"; shift 2 ;;
    --repo)  repo="${2:?--repo needs a value}"; shift 2 ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "error: unknown argument '$1' (try --help)" >&2; exit 2 ;;
  esac
done

if ! command -v git >/dev/null 2>&1; then
  echo "error: git is not installed; fall back to asking the user for friction hotspots" >&2
  exit 1
fi
if ! git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "error: '$repo' is not a git repository; churn analysis unavailable" >&2
  exit 1
fi

echo "== Churn: most-changed files since '$since' (top $top) =="
git -C "$repo" log --since="$since" --name-only --format= \
  | grep -v '^$' | sort | uniq -c | sort -rn | head -n "$top" || true

if [[ -n "$file" ]]; then
  echo
  echo "== Co-change: files most often committed with '$file' since '$since' (top $top) =="
  commits=$(git -C "$repo" log --since="$since" --format='%H' -- "$file")
  if [[ -z "$commits" ]]; then
    echo "(no commits touch '$file' in this window)"
  else
    total=$(printf '%s\n' "$commits" | wc -l | tr -d ' ')
    echo "($total commits touch '$file')"
    printf '%s\n' "$commits" \
      | while read -r c; do git -C "$repo" show --name-only --format= "$c"; done \
      | grep -v '^$' | grep -vxF "$file" | sort | uniq -c | sort -rn | head -n "$top" || true
  fi
fi
