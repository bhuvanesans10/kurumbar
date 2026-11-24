# Deep Backend Architecture Standards (NestJS)

Based on a detailed review across `controllers`, `services`, `modules`, `core`, `external-service` abstractions, and configs within `application-server`, here are the strict standards used across the backend environment.

## 1. Main Runtime Execution & Bootstrapping (`main.ts`)
The `main.ts` execution operates uniquely from standard NestJS wrappers:
- **Sentry at Root**: App is traced natively via `import "./sentry-setup/instrument";` at absolute top-level.
- **ALB Port Relay**: The application binds not just one, but often TWO HTTP servers dynamically using `FastifyAdapter`. The main port, and a secondary `ALB_PORT`, relaying traffic to the same fastify instance routing for isolated infrastructure load-balancing. Both servers are bound explicitly into the `SharedSocketIoAdapter`.
- **Metrics Guarding**: `metricsGuardMiddleware(port)` checks the raw TCP socket requesting `/${globalAppPrefix}/metrics` and explicitly throws a 404 if the request is not hitting the secure internal port, stopping edge exposure.
- **Graceful Shutdown Hook**: A custom `ShutdownObserver` collects the active generic HTTP servers + ALB servers. `SIGTERM`/`SIGINT` trigger clean drains across all ports, ensuring Zero-Downtime rollouts.
- **Fastify Native**: Fully reliant on direct Fastify ecosystems (`@fastify/compress`, `@fastify/helmet`, `@fastify/cookie`).

## 2. Directory & Module Structure
A typical module is deeply structured:
- `*.module.ts`, `*.controller.ts`, `*.service.ts`: The primary triad.
- **`dto/`**: Contains `*.dto.ts` class-validator boundaries.
- **`core/`**: Houses deeply specific business logic meant to be isolated. Includes hard-coded configuration mappings for Global Guards.
- **`helpers/`**: For utility wrappers typically interacting with external services or Redis caches.
- **`interface/`**: Contains raw TypeScript definitions often specifically designed for performance/memory bounds when touching Redis.
- **`external-service/`**: Houses 3rd-party integrations (e.g., Banking, CDN, Distance-Estimation, SNS). Operations abstract third-parties behind standard unified Interfaces (`IPaymentsService`), dynamically delegating logic between `providers/` (like Razorpay vs Cashfree) to prevent vendor lock-in.

## 3. Environment Variables Injection
The codebase enforces an aggressive fail-fast pattern for Environment Variables to prevent runtime `undefined` collisions.
- **Constructor Validation**: When an Environment variable is loaded directly into a service, it is checked immediately in the constructor. Throw `InternalServerErrorException` explicitly if a key is missing during initialization.

## 4. Logger Implementation
Logging is executed through the native NestJS `Logger` module, but almost strictly initialized as a `private static` class property.

## 5. Security & AppType Guards
- Instead of using native Express types, the codebase restricts itself to **FastifyRequest** (`import { FastifyRequest } from "fastify"`).
- **Aggressive Controller Guards**:
  - The `GlobalAuthGuard` actively reads from hardcoded mappings inside `auth/core/internal-only.config.ts` and `auth/core/exclusion.config.ts` (mapping absolute Controller array names like `"SupportChatGenieBotWebhooksController"`). If a controller matches these lists, JWT checks are immediately bypassed/blocked depending on the context. This centralizes webhooks/internal bypassing completely outside of scattered Controller local decorators. 

## 6. Time and Timezone Synchronization
All dates and times handled must conform rigidly to the centralized `TimeConversionsCore` logic:
- The backend leverages `date-fns` and `date-fns-tz` almost exclusively.
- **Locales Over JS Defaults**: Time conversion relies on hardcoded Locale strings (e.g., `IN` maps to `Asia/Kolkata`, `US` to `America/New_York`) using `toZonedTime` preventing generic JS offset mismatches.
- Explicit Throwing: Validation of time strings (e.g. `12:30:00`) explicitly triggers an `InternalServerErrorException` rather than casually logging `NaN`. Dates are rigorously stripped of localization boundaries before touching the Prisma Datastore.

## 7. gRPC & Dual Exposure Patterns
Operations (such as `McpFinancialService`) are uniquely exposed via a dual-controller pattern: 
- **REST Exposure (`mcp.controller.ts`)**: Exposes REST interfaces requiring an `x-api-key` header.
- **gRPC Exposure (`mcp-financial.grpc-controller.ts`)**: Exposes through `@GrpcMethod()`. They manually map `data` to a strongly typed explicitly defined Interface, await the service, and execute `return JSON.parse(JSON.stringify(result))` to strip out object prototypes safely avoiding serialization panics over the wire.
