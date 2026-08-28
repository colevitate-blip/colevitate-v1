#!/usr/bin/env bash
# Greps src/ for the usual causes of mobile horizontal-overflow bugs.
# Doesn't replace the runtime sweep — run this once it flags a page and
# you need to find *why*. Usage: bash qa/mobile-root-cause-grep.sh [src]
set -euo pipefail
SRC="${1:-src}"

echo "── Duplicate class= attributes (second one silently wins) ──"
grep -rnoE '<[a-zA-Z]+[^>]*class="[^"]*"[^>]*class="[^"]*"' "$SRC" || echo "  none found"

echo
echo "── Inline style= with grid/flex properties (media queries can't override) ──"
grep -rnoE 'style="[^"]*(grid-template-columns|display:\s*flex|display:\s*grid)[^"]*"' "$SRC" || echo "  none found"

echo
echo "── grid-template-columns: 1fr without minmax(0, ...) ──"
grep -rnoE 'grid-template-columns:\s*[^;]*[^m]1fr[^;]*' "$SRC" | grep -v 'minmax' || echo "  none found"

echo
echo "── Negative inset/offset on positioned elements ──"
grep -rnoE '(inset|top|left|right|bottom):\s*-[0-9]+(px|%|rem)' "$SRC" || echo "  none found"

echo
echo "── iframe embeds (check for a static, non-animated variant) ──"
grep -rnoE '<iframe[^>]*src="[^"]*"' "$SRC" || echo "  none found"
