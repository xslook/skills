#!/bin/sh
# Pinned Chart.js Vendoring Script
# Downloads Chart.js v4.4.8 UMD build and verifies SHA-256 checksum.
# Zero Node.js / zero npm dependency.

set -eu

VERSION="4.4.8"
EXPECTED_SHA256="c40877e88de4df7201532014e14fb707f0f07a196a4ec63e070544b80184fb00"
URL="https://cdn.jsdelivr.net/npm/chart.js@${VERSION}/dist/chart.umd.min.js"

TARGET_DIR="${1:-./templates/static/vendor}"
mkdir -p "$TARGET_DIR"
DEST_FILE="$TARGET_DIR/chart.umd.min.js"
TEMP_FILE="$(mktemp)"

cleanup() {
  rm -f "$TEMP_FILE"
}
trap cleanup EXIT

echo "==> Downloading Chart.js v${VERSION}..."
curl -sSL "$URL" -o "$TEMP_FILE"

if command -v sha256sum >/dev/null 2>&1; then
  ACTUAL_SHA256=$(sha256sum "$TEMP_FILE" | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then
  ACTUAL_SHA256=$(shasum -a 256 "$TEMP_FILE" | awk '{print $1}')
else
  echo "Error: Neither sha256sum nor shasum is available to verify integrity." >&2
  exit 1
fi

if [ "$ACTUAL_SHA256" != "$EXPECTED_SHA256" ]; then
  echo "Error: Checksum verification failed!" >&2
  echo "Expected: $EXPECTED_SHA256" >&2
  echo "Actual:   $ACTUAL_SHA256" >&2
  exit 1
fi

mv "$TEMP_FILE" "$DEST_FILE"
echo "==> Successfully verified and vendored Chart.js to $DEST_FILE"
