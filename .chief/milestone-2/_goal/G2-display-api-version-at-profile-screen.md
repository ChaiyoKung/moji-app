# G2 — Display Backend API Version at Profile Screen

## Goal

Display the backend API version inline within the existing `AppVersion` component on the Profile screen.

## Motivation

Users and support staff need visibility into which backend API version the app is communicating with, to aid in debugging and version compatibility checks.

## Acceptance Criteria

1. `GET /api/version` is added to `src/libs/api.ts` with response type `{ version: string }` using the authenticated `api` instance.
2. A new feature component `ApiVersion` is created at `src/features/api-version/index.tsx`.
3. `ApiVersion` fetches the API version via TanStack Query.
4. The Profile screen renders `<AppVersion />` and `<ApiVersion />` on the same line separated by `•`.
5. On API error, `ApiVersion` shows an amber error indicator.
6. `AppVersion` is NOT modified — existing behavior fully preserved.
