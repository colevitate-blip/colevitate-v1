---
description: Run a one-shot autonomous mobile-overflow sweep of the whole site (no bug report needed)
---

Run the mobile responsive sweep (`qa/mobile-viewport-sweep.mjs`) against this
repo. This is a one-time manual check, not a watcher — run it, read the
report, stop.

Arguments passed to this command: $ARGUMENTS
- if it contains `full`, set `MOBILE_FULL=1` (check every discovered route, not just one per template)
- if it contains `all-locales`, set `MOBILE_ALL_LOCALES=1` (check all 5 locales instead of just `en`)
- these can combine

Steps:
1. Check whether something is already listening on `http://localhost:3000`
   (e.g. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`). If
   nothing responds, start `npm run dev` in the background and poll until it
   responds before continuing. Remember whether you started it.
2. Run `npm run qa:mobile`, with any env vars from the arguments above.
3. Read `qa/reports/mobile-viewport-report.json` and summarize: which
   routes overflowed, at which device/width, the worst offending element for
   each, and the screenshot path.
4. If anything overflowed, run `bash qa/mobile-root-cause-grep.sh` and
   cross-reference its hits against the flagged elements to name the likely
   root cause per bug — don't fix anything yet, just report.
5. If you started the dev server in step 1, stop it now that the sweep is
   done.
6. Give a short final summary: N routes checked, N overflow bugs found, one
   line per bug (route, device, likely cause).
