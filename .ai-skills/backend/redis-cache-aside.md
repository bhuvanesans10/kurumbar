# Redis Cache-Aside Pattern

> [!WARNING]
> This project is built to tolerate **100% Redis data loss**. Redis is a performance optimisation layer, never a source of truth. Every cache-aside read MUST have a fallback to the authoritative datastore (Postgres via Prisma, DynamoDB, etc). Never let a Redis failure crash a request.

## 1. Key Ownership & Naming Convention

Each backend service owns a unique key prefix. **The service that creates the key is the prefix owner.** Never use another service's prefix.

| Service | Prefix | Meaning |
|---|---|---|
| `application-server` | `ag:` | Application Gateway |
| `fleet-gateway` | `dg:` | Delivery Gateway |
| `kurumbar-api` | `km:` | Kurumbar Community API |
| `support-process-mcp-server` | `mcp:` | MCP Server |
| `invoice-and-cron-microservice` | `icm:` | Invoice & Cron Microservice |

All Redis keys use a static base defined on `RedisDataStoreService`:

```typescript
// Use YOUR service's prefix — the creating service is the key owner
public static readonly myFeatureKeyBase = `<prefix>:<domain>:<purpose>:`;
// Example (application-server): ag:restaurant-refund-rules:
// Example (fleet-gateway):      dg:delivery-demand:
// Example (mcp-server):         mcp:r-token-lock:
```

The `RedisDataStoreService` automatically prepends the deployment-environment prefix (`dev-`, `staging-`, `prod-`) to every key via `statefulDeploymentEnvironmentTopicPrefix`. **Do not add the env prefix yourself.** Append the entity ID when using the key.

## 2. Cache-Aside Read Pattern

```typescript
// 1. Try Redis
const cached = await this.redisDataStoreService.getString(
  `${RedisDataStoreService.myFeatureKeyBase}${entityId}`,
);

if (cached !== null) {
  return JSON.parse(cached) as MyInterface;
}

// 2. Cache miss → query DB (authoritative source)
const dbResult = await this.prisma.myTable.findFirst({ ... });

if (!dbResult) {
  return null; // or default value — do NOT cache nulls
}

// 3. Backfill Redis with TTL (fire-and-forget on non-critical paths)
const payload: MyInterface = { /* map from dbResult */ };
this.redisDataStoreService
  .setString(
    `${RedisDataStoreService.myFeatureKeyBase}${entityId}`,
    JSON.stringify(payload),
    "EX",
    CACHE_TTL_SECONDS,
  )
  .catch((err) =>
    this.logger.warn(`Failed to cache ${entityId}: ${err.message}`),
  );

return payload;
```

## 3. TTL Guidelines

| Data type | TTL | Rationale |
|---|---|---|
| Per-entity config (refund rules, tax rates) | 900s (15 min) | Rarely changes, admin-updated |
| Session / auth data | varies | Security-driven, use existing patterns |
| Order-scoped data (geo, meta) | 86400s (24 hours) | Lifecycle-bound, cleaned after fulfilment |
| Global config / KB data | 300s (5 min) | May change via DynamoDB/admin |

## 4. Cache Invalidation

- **On mutation**: When an admin updates a cached entity (e.g., refund rules), explicitly delete the Redis key:
  ```typescript
  await this.redisDataStoreService.deleteKeys(
    `${RedisDataStoreService.myFeatureKeyBase}${entityId}`,
  );
  ```
- **On TTL expiry**: Let TTL handle natural staleness. For critical config, subscribe to keyspace notifications (see `SupportConfigRedisHelperService.subscribeToConfigKeyExpiry` in application-server).

## 5. Data Type Convention

- Use `setString` / `getString` with `JSON.stringify` / `JSON.parse` for structured data.
- Use `setHash` / `getHash` only for flat key-value structures that benefit from partial field reads.
- Always document the interface type and key pattern in the static key declaration comment.

## 6. Error Handling

- **Never throw on Redis failure.** Every `RedisDataStoreService` method already catches errors, logs, and sends Telegram notifications. The return value is `null` / `0` / `[]` on failure.
- **Callers must treat null as cache miss**, not as an error. Fall through to the DB path.
- **Backfill writes should be fire-and-forget** (`.catch(log)`) on non-critical paths to avoid blocking the response.

## 7. Anti-Patterns

- ❌ **Never cache `null` or empty results** — this creates "negative cache" that masks DB recovery.
- ❌ **Never use Redis as the only storage** — always have a DB write first.
- ❌ **Never rely on Redis for financial data integrity** — settlement amounts, refund states, and ledger entries must always come from Postgres.
- ❌ **Never set infinite TTL** — all keys must expire to prevent memory bloat.
- ❌ **Never use another service's key prefix** — each service owns its namespace.
