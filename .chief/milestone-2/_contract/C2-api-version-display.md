# C2 — API Version Display Contract

## API Function: `getApiVersion`

File: `src/libs/api.ts`

```ts
export interface ApiVersionResponse {
  version: string;
}

export async function getApiVersion() {
  const response = await api.get<ApiVersionResponse>("/api/version");
  return response.data;
}
```

- Uses the authenticated `api` (Axios) instance.
- Query key: `["version"]`

## Feature Component: `ApiVersion`

File: `src/features/api-version/index.tsx`

```ts
const apiVersionQuery = useQuery({
  queryKey: ["api-version"],
  queryFn: getApiVersion,
});
```

- Access data via `apiVersionQuery.data`, `apiVersionQuery.isError`.
- Do NOT destructure `{ data }` from `useQuery` (convention).

## Display Logic for `ApiVersion`

| State | Output |
|---|---|
| Loading | `"Loading API version..."` in `text-typography-500` |
| Success | `"API v{version}"` in `text-typography-500` |
| Error | `"API version not available"` in `text-amber-500` |

## Profile Screen Layout

File: `src/app/(tabs)/profile.tsx`

Replace the existing `<Center><AppVersion /></Center>` with:

```tsx
<Center>
  <HStack space="xs" className="items-center">
    <AppVersion />
    <Text size="xs" className="text-typography-500">•</Text>
    <ApiVersion />
  </HStack>
</Center>
```

- `AppVersion` is NOT modified.
- `ApiVersion` is a new named export from `src/features/api-version/index.tsx`.
