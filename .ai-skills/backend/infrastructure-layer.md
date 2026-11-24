# Infrastructure & Messaging Constraints

> [!WARNING]
> This ruleset is aggregated from core infrastructure extraction files. When scaling or building new microservices utilizing Kafka or Redis, abide strictly by these rules to prevent container cascade failures.

## 1. Event Topic Naming Schema
Kafka topics are no longer global variables. A topic specified as `order-dispatched` must never be hardcoded. 
- You must prepend the execution topology value (`dev-`, `staging-`, `prod-`) implicitly to the topic string right before Consumer or Producer attachment. This prevents cross-contamination across Database VPC bounds.
- Use `STATEFUL_DEPLOYMENT_ENVIRONMENT` variables directly.

## 2. Partitioning Determinism
Never use default `null` key hashing against stateful order payloads.
- If firing lifecycle changes for an entity (e.g., An Order moving from `Pending` -> `Accepted` -> `Ready`), you must use the `Entity_ID` (the CUID) as the static Key. The internal hashing will allocate that Key's sequence into a static Kafka partition. Default mapping causes random distribution, shattering event sequential chronicity.

## 3. The `Promise.allSettled` Fail-Fast Mandate
When bootstrapping external persistence arrays (Spinning up `N` number of Kafka Subscriptions or multiple Redis Caches during `onApplicationBootstrap`), wrap the initializations in `Promise.allSettled`. 
If even one mapping returns `rejected`, throw. The HTTP Server must purposefully crash and fail Liveness probes rather than serve HTTP traffic while "partially deaf" to background messaging queues.
