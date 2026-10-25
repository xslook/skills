#!/bin/sh
# web-dashboard Static Quality & Security Auditor
# Verifies compliance with zero-build, CSP-strict, and tokenized design rules.

set -e

TARGET="${1:-.}"
ERRORS=0

log_fail() {
  echo "  [FAIL] $1" >&2
  ERRORS=$((ERRORS + 1))
}

log_pass() {
  echo "  [PASS] $1"
}

echo "=== Auditing Web Dashboard Compliance in: $TARGET ==="

# 1. Check for Node.js / npm artifacts in the deployment target
echo "--- Checking for Node.js dependencies ---"
if find "$TARGET" -name "package.json" -o -name "node_modules" 2>/dev/null | grep -q .; then
  log_fail "Found package.json or node_modules in target. Dashboards must not require Node.js runtimes."
else
  log_pass "Zero Node.js / npm artifacts detected."
fi

# 2. Check for inline event handlers in templates/html (CSP violation)
echo "--- Checking for inline event handlers (onclick, onchange, etc.) ---"
INLINE_HANDLERS=$(grep -rnE ' (on[a-zA-Z]+)="[^"]*"' "$TARGET" --include="*.html" --include="*.tmpl" 2>/dev/null || true)
if [ -n "$INLINE_HANDLERS" ]; then
  echo "$INLINE_HANDLERS" >&2
  log_fail "Found inline event handlers. Use data-action and delegated listeners instead."
else
  log_pass "No inline event handlers detected."
fi

# 3. Check for external CDN script/link tags
echo "--- Checking for external CDN dependencies ---"
EXTERNAL_SCRIPTS=$(grep -rnE '<(script|link)[^>]+(src|href)=["'"'"']https?://' "$TARGET" --include="*.html" --include="*.tmpl" 2>/dev/null || true)
if [ -n "$EXTERNAL_SCRIPTS" ]; then
  echo "$EXTERNAL_SCRIPTS" >&2
  log_fail "Found external CDN scripts/links. All assets must be vendored and embedded."
else
  log_pass "All static assets are locally hosted / vendored."
fi

# 4. Check for hardcoded colors in component CSS files (outside tokens.css)
echo "--- Checking for hardcoded colors in component CSS ---"
HARDCODED_COLORS=$(grep -rnE '(#([0-9a-fA-F]{3,8})|rgb\(|hsl\()' "$TARGET" --include="*.css" --exclude="tokens.css" 2>/dev/null || true)
if [ -n "$HARDCODED_COLORS" ]; then
  echo "$HARDCODED_COLORS" >&2
  log_fail "Found hardcoded colors in CSS. Use semantic CSS variables (var(--*)) instead."
else
  log_pass "All component styles use semantic design tokens."
fi

# 5. Check for unsafe innerHTML assignments in JS (except core/swap.js)
echo "--- Checking for unsafe innerHTML assignments ---"
UNSAFE_INNER_HTML=$(grep -rnE '\.innerHTML\s*=' "$TARGET" --include="*.js" --exclude="swap.js" 2>/dev/null || true)
if [ -n "$UNSAFE_INNER_HTML" ]; then
  echo "$UNSAFE_INNER_HTML" >&2
  log_fail "Found innerHTML assignment outside swap.js. Use textContent or DOM APIs."
else
  log_pass "No unsafe innerHTML assignments detected."
fi

echo "======================================================"
if [ "$ERRORS" -gt 0 ]; then
  echo "Audit FAILED with $ERRORS violation(s)." >&2
  exit 1
else
  echo "Audit PASSED: 100% compliant with web-dashboard specifications."
  exit 0
fi
