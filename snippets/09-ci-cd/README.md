# 09 - CI/CD

GitHub Actions deploys to Azure App Service on every push to `main`. Notable choices:

- **Typecheck gate** before build, so a broken commit never ships.
- **Commit stamp + health check**: the smoke test waits until `/api/health` reports *this* commit, rather than probing a route that exists in both old and new builds.
- **Post-deploy seeding via the running app**, so the runner never needs database credentials.
- Secrets live in GitHub Secrets (`AZURE_WEBAPP_PUBLISH_PROFILE`, `MAINTENANCE_TOKEN`); the file contains placeholders only.
