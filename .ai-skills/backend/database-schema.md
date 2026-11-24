# Database & Schema Structural Norms

> [!WARNING]
> This ruleset bounds how Artificial Intelligence modifies or queries Postgres (Prisma) and Redis inside `kurumbar-api` (derived from `fleet-gateway`). Standard CRUD patterns must conform exactly.

## 1. Zero Trust Prisma
No table data is permanently deleted without intense overriding exception rules. Most schemas contain `isDelete` natively.
- Any lookup for "Active Users" must implicitly wrap `where: { isDelete: false }`. Hard-deletions via Postgres `.delete()` are fundamentally violations.

## 2. Redis Key Centralized Dictionary Constraint
Under no circumstance should you dynamically craft raw string Keys manually inline (e.g. `redis.set("user-session:" + id)`). 
- All keys must be declared strictly as `public static readonly` inside `redis-data-store.service.ts`.
- Environment boundaries (`dev-`, `prod-`) are mapped **internally** by the service wrapper methods, not by the specific route consuming them.

## 3. Nested Transaction Rollbacks
If a specific Prisma call cascades an email, creates a redis state, AND adjusts database boolean attributes, the operation must be locked entirely inside `this.prisma.$transaction(...)`. Never perform non-reversible DB logic unless the external calls succeed, or vice-versa.

## 4. Prisma Schema Layout Convention
The `prisma/schema.prisma` file maintains a strict structural separation:
- **Models** are declared in the **upper section** of the file.
- **Enums** are grouped in the **lower section** of the file, after all models.

When adding new schema elements:
- New **models** must be appended at the **end of the models section** (before the first `enum` declaration).
- New **enums** must be appended at the **end of the enums section** (bottom of the file).
- **Never interleave** models and enums — they must remain in their respective sections.

## 5. Migration File Immutability
Once a migration file has been applied to **any** database (local, staging, or production), it is **immutable** and must **never be deleted** from the `prisma/migrations/` directory.

- **Never drop a migration file** — even if the schema change it introduced is being reversed. Instead, create a **new migration** that rolls back the schema change (e.g. re-create a dropped table, re-add a dropped column).
- If a model or table needs to be removed, write a new migration with the reverse DDL. Do not delete the original migration that created it.
- Before committing any migration changes, run `npx prisma migrate status` to verify zero drift between the local migration history and the database.
- After modifying `schema.prisma`, **ask the user** to run `npx prisma migrate dev` to generate and apply the migration, then commit the resulting migration file.
