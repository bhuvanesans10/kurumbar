# Frontend System Constraints (Flutter)

## 1. Provider Context Null Safety
When executing `Provider.of<T>(context, listen: false)` across multiple instances simultaneously, especially during asynchronous events (like `clear_all_providers.dart`), you must structurally wrap operations inside a strong `try-catch` and explicitly check if `context.mounted` or `context != null`. Silent null exceptions kill the screen pipeline without crashing the root `MaterialApp`, hanging the UI loop.

## 2. API Contract Strictness 
For API interactions targeting `kurumbar-api`, avoid generating new custom classes inside Flutter endpoints directly unless generating a model matching the backend DTO structurally (via `json_serializable`). Keep the UI isolated. Only touch logic layers, passing `state.extra` directly down to API wrappers.

## 3. Route Declaration Rigidity
When adding a new logic flow to `kurumbar-app` or any flutter module:
1. No dynamic mapping in button clicks (e.g. `Navigator.push()`).
2. Add the GoRoute explicitly to `GoRouter/navigator.dart`.
3. Use `context.pushNamed('Name', extra: {})` to utilize the single-source-of-truth router pipeline.
