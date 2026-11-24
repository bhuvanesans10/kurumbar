# External Integrations & Webhooks Rules

## 1. Zero Trust Webhook Integrity
When writing Webhook handlers (Payment Gateway, External Checks), **NEVER** trust the provided `rawBody` natively without recalculation.
- You must inject `crypto` and manually rebuild the `createHmac("sha256")` signature.
- Check it strictly via absolute string comparison against `receivedSignature` headers before evaluating the logic.

## 2. Hard Metric Observability
Include `@InjectMetric` (`Counter` and `Histogram` from `prom-client`) in integration services.
- Always use `const endTimer = this.paymentProcessingDuration.startTimer({ gateway: "platform", event_type: "hook" });` and ensure it is mathematically closed `endTimer();` within `try-catch` blocks.

## 3. Strict Payload Sanitization
If implementing custom interceptors for AI or External services (like `McpLoggingInterceptor`), you must aggressively slice `["password", "token", "apiKey", "secret", "creditCard"]` inside request payloads prior to any `Logger.log` or database interactions.
