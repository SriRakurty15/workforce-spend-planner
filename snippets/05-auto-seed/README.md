# 05 - Auto-seed

Seeds empty datasets only; never overwrites existing rows. Failures are collected and reported (not thrown), so
a deploy can't report success while datasets silently stay empty. Reported by a protected `/api/maintenance/status` endpoint.
