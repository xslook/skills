# Resolving Merge, Rebase & Cherry-Pick Conflicts

Resolve hunk by hunk by working out what each side meant to do. Don't `--abort` early and don't guess lines.

## 1. Identify the Operation (it changes what "ours" means)

```bash
git status            # says "rebase in progress", "You have unmerged paths", etc.
ls .git/MERGE_HEAD .git/REBASE_HEAD .git/CHERRY_PICK_HEAD 2>/dev/null
```

| Operation | `HEAD` / `--ours` | `--theirs` | Incoming ref |
| :--- | :--- | :--- | :--- |
| `git merge <branch>` | your current branch | `<branch>` | `MERGE_HEAD` |
| `git rebase <upstream>` | **upstream** (the base being replayed onto) | **your commit** being replayed | `REBASE_HEAD` |
| `git cherry-pick <sha>` | your current branch | the picked commit | `CHERRY_PICK_HEAD` |

> [!WARNING]
> During a **rebase**, `--ours` and `--theirs` are swapped compared with a merge. `git checkout --ours file` during a rebase keeps the *upstream* version and throws away your change.

## 2. Understand Both Sides

```bash
# Use the incoming ref for the operation in progress:
INCOMING=$(git rev-parse -q --verify MERGE_HEAD || git rev-parse -q --verify REBASE_HEAD || git rev-parse -q --verify CHERRY_PICK_HEAD)
BASE=$(git merge-base HEAD "$INCOMING")

git log --oneline "$BASE..HEAD"       -- <file>   # why HEAD side changed
git log --oneline "$BASE..$INCOMING"  -- <file>   # why incoming side changed
git diff --name-only --diff-filter=U               # all conflicted files
```

Read the commit messages and linked issues. The goal is to keep both intents, not to pick a winner.

## 3. Show the Common Ancestor (zdiff3)

```bash
# Re-render ONE file with ancestor context. This DISCARDS any manual edits to that file.
git checkout --conflict=zdiff3 <file>     # git >= 2.35; use diff3 on older git

# Or enable it for future conflicts in this repo:
git config merge.conflictStyle zdiff3
```

```
<<<<<<< HEAD          (ours, see table above)
||||||| base          (common ancestor: what the code looked like before both changes)
=======
>>>>>>> incoming      (theirs)
```

Compare each side against the **base**. That shows exactly what each side changed.

## 4. Resolve by Type

| File type | Strategy |
| :--- | :--- |
| Source code | Merge both intents by hand. Rename on one side + edit on the other → apply the edit to the renamed code. |
| Lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `Cargo.lock`, `go.sum`, `poetry.lock`) | Never hand-edit. Resolve the manifest (`package.json`, …) first, take the target branch's lockfile, then regenerate (`npm install`, `pnpm install`, `cargo update -w`, `go mod tidy`). |
| Generated files (codegen, build output, snapshots) | Take either side, then rerun the generator. |
| Binary files | Pick one side whole: `git checkout --ours/--theirs <file>` (check the table first). |
| Deleted on one side, modified on the other | Decide whether the deletion still holds. `git rm <file>` or `git add <file>`. |

Lockfile example for a **merge** (target = your branch = `--ours`):

```bash
git checkout --ours package-lock.json && npm install && git add package-lock.json
```

For a **rebase** the upstream is `--ours`, so the same command takes upstream's lockfile, which is usually what you want before regenerating.

## 5. Verify

```bash
git diff --check                                    # flags leftover markers and whitespace errors
git grep -nE '^(<{7}|\|{7}|={7}|>{7})( |$)' -- $(git diff --name-only --diff-filter=U)
<project test / typecheck / lint command>
```

## 6. Continue Non-Interactively

```bash
git add <resolved-files>
GIT_EDITOR=true git merge --continue        # or: git rebase --continue / git cherry-pick --continue
```

Without `GIT_EDITOR=true`, git opens an editor and the agent hangs.

## Tips

- **Repeated conflicts across a long rebase**: `git config rerere.enabled true` records your resolutions and replays them.
- **Abort is fine when the approach is wrong** (wrong base, wrong branch): `git merge --abort` / `git rebase --abort` returns to the pre-operation state. Don't use it just because the conflicts are hard.
- **Botched a finished rebase**: `git reset --hard ORIG_HEAD` (destructive, confirm with the user) or branch from `git reflog`.
