# Release Tagging & Deploy Verification

## 1. Determine the Range & Version

```bash
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null)
RANGE=${LAST_TAG:+$LAST_TAG..}HEAD                    # whole history if no tag yet
git log --format='%h %s' "$RANGE"
git log --format='%B' "$RANGE" | grep -qE 'BREAKING CHANGE|^[a-z]+(\([^)]*\))?!:' && echo "MAJOR bump"
```

SemVer from Conventional Commits:

| Commits since last tag contain | Bump |
| :--- | :--- |
| `BREAKING CHANGE:` footer or `type!:` | **major** (minor while `0.x`) |
| any `feat` | **minor** |
| only `fix` / `perf` / others | **patch** |

If the repo uses release tooling (`release-please`, `semantic-release`, `changesets`, `cargo release`, `goreleaser`), run that instead of tagging by hand.

## 2. Changelog Draft

```bash
for t in feat fix perf refactor; do
  echo "### $t"; git log --format='- %s (%h)' "$RANGE" | grep -E "^- $t(\(|!|:)" | sed -E "s/^- $t(\([^)]*\))?!?: /- /"
done
```

## 3. Tag (Local) → Push (Needs User Confirmation)

```bash
git status --short                 # must be clean
git tag -a v1.2.0 -m "v1.2.0: avatar upload, rate limiting"
git show --stat v1.2.0             # verify the tag points at the intended commit
# After the user confirms:
git push origin v1.2.0             # push the single tag, not --tags
```

## 4. Release Readiness Checklist

```markdown
## Deploy Checklist: <service> <tag>
**Target:** Production / Staging | **Commit:** `<git rev-parse --short HEAD>`

### Pre-Deploy
- [ ] CI is green on this exact commit (tests, lint, build).
- [ ] Required PR approvals and review are done.
- [ ] DB migrations tested in staging and backward compatible with the previous release.
- [ ] Feature flags configured; new behavior off by default when risky.
- [ ] Secrets / env vars provisioned in the target environment.
- [ ] Rollback plan written: previous tag `<vX.Y.Z>`, plus migration down-path or forward-fix.

### Execute
- [ ] Deploy to staging / canary first; run smoke tests.
- [ ] Deploy to production (rolling / blue-green).
- [ ] Watch error rate and p95/p99 latency for >= 15 min.

### Rollback Triggers (decide before deploying)
- Error rate > <0.5% or 2x baseline>
- p99 latency > <500ms>
- Any core flow (login, payment, ingestion) fails smoke checks
```

The agent fills in what it can verify (CI status via `gh run list`, the commit, the tag) and leaves operational items for the human.
