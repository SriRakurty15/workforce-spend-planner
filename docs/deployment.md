# Deployment

1. Create an Azure SQL database and an App Service (Node, Linux).
2. Set App Settings: `DATABASE_URL`, `MAINTENANCE_TOKEN`, optional `ANTHROPIC_API_KEY`.
3. Add GitHub secrets: `AZURE_WEBAPP_PUBLISH_PROFILE`, `MAINTENANCE_TOKEN`.
4. Push to `main`. The workflow in `snippets/09-ci-cd/deploy.yml` builds, deploys, verifies the commit is live, and seeds empty datasets.

Local run uses SQLite via Prisma with no cloud account.
