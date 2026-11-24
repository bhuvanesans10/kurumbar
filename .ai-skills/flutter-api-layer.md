# Flutter API Layer Standards

These rules dictate how API interactions are handled in `kurumbar-app` (following `the-genie-customer-app` and `the-genie-delivery-partner` patterns).

## 1. Network Package & Structure
- **Library**: `http` package is the core tool (`import 'package:http/http.dart' as http`). No Retrofit or Dio (for auth routes anyway).
- **Service Wrappers**: API endpoints are grouped into classes (e.g. `ProtectedRoutesApi`). 

## 2. Protected Requests & Interceptors
- **Request Wrapper**: ALWAYS use the central request wrapper, `ProtectedRoutesApiService.makeRequest()`. 
  - Do not use raw `http.get` or `http.post` directly if the endpoint requires an `Authorization: Bearer <token>` header.
- **Refresh Token Interceptor**: 
  - `ProtectedRoutesApiService` automatically relies on a Singleton `RefreshTokenInterceptor`.
  - The interceptor proactively checks for JWT expiry (`ApiConfig.accessTokenExpiry`). If near expiry, it calls out to `PublicRoutesApi.authRefresh` to get new tokens before firing the real request.
  - **401 Handling**: The API service has built-in retry mechanics for 401 Unauthorized responses. If a retry fails, it triggers `AuthManager.logoutOnTokenFailure()`.

## 3. Response Parsing
- Responses are mapped to a standard `ApiResponse` object containing:
  - `statusCode`
  - `isSuccess` (`boolean` mapping 2xx status)
  - `data` (`dynamic` parsed JSON body)
  - `message`
- **Error Checking**: Your UI providers and repositories must check `if (response.isSuccess)` before casting `response.data`.

## 4. API Configurations
- Base URLs are stored securely via `FlutterSecureStorageKey.endPoint` and fetched via `ApiConfig.getEndpoint()`.
- Fallbacks exist in `.env` variables (`dotenv.env['API_BASE_URL']`).
