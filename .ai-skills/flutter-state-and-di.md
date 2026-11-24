# Flutter State Management & DI Standards

This guide outlines state and dependency injection rules for `kurumbar-app`, based on `the-genie-customer-app`.

## 1. State Management (Provider)
- **Library**: `provider: ^6.1.2`
- **Pattern**: `ChangeNotifier` -> `ChangeNotifierProvider`
- **Implementation**: 
  - Business logic and app state sit inside `lib/backend/providers/`.
  - Providers must extend `ChangeNotifier` and call `notifyListeners()` upon state changes.
  - Providers are injected globally in `main.dart` inside the `MultiProvider` block (`_rootProviders`).
- **UI Access**: 
  - Use `context.read<MyProvider>()` for calling methods without rebuilding.
  - Use `Consumer<MyProvider>` or `context.watch<MyProvider>()` when building UI elements reactive to data.

## 2. Dependency Injection Strategy
- **No Heavy DI Frameworks**: The project avoids strict DI containers like `get_it` or `injectable`.
- **Services & APIs**: Utility services (like `FirebaseCoreService`, `SharedPreferencesService`) are generally static singletons initialized explicitly in `main.dart` before `runApp`.

## 3. Strict UI and Logic Boundary
- **Never mix UI and API**: The `.dart` files inside `lib/pages/` or `lib/components/` must NEVER run direct HTTP requests.
- **Workflow**:
  1. UI triggers an action (e.g. `context.read<DeliveryProvider>().fetchOrders()`).
  2. The Provider makes a call to an API service class or network layer.
  3. The Provider parses the models, updates its list, and calls `notifyListeners()`.
  4. The UI reconstructs.

## 4. Environment Variables
- `flutter_dotenv` is used.
- Load `dotenv.load(fileName: ".env")` during the bootstrap in `main.dart`.
- Access safely using `dotenv.env['KEY'] ?? 'fallback'`.
