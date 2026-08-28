#!/usr/bin/env bash
# Crawls the site from QA_BASE_URL, flags 404s, redirect loops, and broken
# external links. Needs the site running first (`npm run dev` or `npm run start`).
set -euo pipefail
BASE_URL="${QA_BASE_URL:-http://localhost:3000}"
mkdir -p qa/reports
echo "Crawling $BASE_URL ..."
npx linkinator "$BASE_URL" --recurse | tee qa/reports/link-report.txt
