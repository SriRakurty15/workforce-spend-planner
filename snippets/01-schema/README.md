# 01 - Schema

Data model for the planner. Key decisions:

- **Composite unique keys** (`fiscalYear + period + category`, etc.) make every write an idempotent upsert, so bulk uploads and re-seeding never create duplicates.
- **Float over Decimal** for money. Prisma returns `Decimal` as an object and `+` on two of them concatenates; Float keeps every dashboard total correct (display rounding handles the rest).
- **One `Allocation` table, three grains** via `scopeType`/`scopeId` (team override > location > category default).
- **`WSP_` table prefix** via `@@map`, so the app can share a database with other systems.
- **`AuditLog`** captures before/after for every change.
