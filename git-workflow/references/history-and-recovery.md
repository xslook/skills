# History Cleanup, Undo & Recovery

> [!IMPORTANT]
> Before any rewrite (`reset`, `rebase`, `commit --amend`), create a safety point:
> `git branch backup/$(git branch --show-current)-$(date +%Y%m%d-%H%M%S)`
> Never rewrite commits already pushed to a **shared** branch (main, master, release/*).

## A. Polish History Before a PR (Non-Interactive)

`git rebase -i` opens an editor, and agents have no TTY. Use these instead.

**Fold a fix into an earlier commit (preferred):**

```bash
git add <files>
git commit --fixup=<target-sha>                       # or --fixup=reword:<sha> to change the message
GIT_SEQUENCE_EDITOR=: git rebase -i --autosquash <target-sha>~1   # target is the root commit? use --root
```

**Squash the last N commits into one:**

```bash
git reset --soft HEAD~N
git commit -m "feat(scope): single clear message"
```

**Scripted todo list (reorder / drop / reword):**

```bash
# Example: turn every 'pick' after the first into 'fixup'
GIT_SEQUENCE_EDITOR="sed -i.bak '2,\$s/^pick/fixup/'" git rebase -i HEAD~3
```

After rewriting a branch that was already pushed (your own feature branch only), ask the user first, then:

```bash
git push --force-with-lease      # refuses if someone else pushed in the meantime
```

## B. Undo Decision Table

| Situation | Command | Destructive? |
| :--- | :--- | :--- |
| Fix the last commit's message (not pushed) | `git commit --amend -m "new msg"` | rewrites 1 commit |
| Add forgotten file to last commit (not pushed) | `git add f && git commit --amend --no-edit` | rewrites 1 commit |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` | no |
| Undo last commit, keep changes unstaged | `git reset HEAD~1` | no |
| Unstage a file | `git restore --staged <file>` | no |
| Undo a **pushed** commit | `git revert <sha>` (merge commit: `git revert -m 1 <sha>`) | no (adds a commit) |
| Discard uncommitted edits in one file | `git restore <file>` | **yes**, edits are unrecoverable |
| Discard everything back to last commit | `git reset --hard` | **yes**, confirm with the user |
| Undo a rebase/merge/reset just performed | `git reset --hard ORIG_HEAD` | **yes**, confirm with the user |
| Committed to the wrong branch | `git branch <correct>; git reset --soft HEAD~1; git switch <correct>` …or `git cherry-pick` onto the correct branch | no |

Uncommitted changes that were never staged or stashed **cannot** be recovered by git. If unsure, `git stash push -u -m "safety"` first.

## C. Recovering Lost Work

**Lost commits (bad reset, rebase, deleted branch):**

```bash
git reflog --date=relative -n 30          # find the SHA right before the mistake
git log --oneline -n 5 <sha>              # confirm it's the right state
git branch recovered/<name> <sha>         # restore without moving HEAD
```

**Deleted branch:** its tip is in `git reflog` (look for `checkout: moving from <branch>`), then do the same as above.

**Dropped or cleared stash:**

```bash
git fsck --no-reflogs --unreachable | awk '/commit/ {print $3}' \
  | xargs -n1 git log -1 --format='%h %s' | grep -E '^[0-9a-f]+ (WIP on|On) '
git branch recovered/stash <sha>          # or: git stash apply <sha>
```

**Verify recovery:** `git diff <backup-or-recovered> <expected>` shows nothing unexpected, and the tests pass.

Reflog entries expire (default 90 days reachable / 30 days unreachable). Never run `git gc --prune=now` or `git reflog expire` during recovery.
