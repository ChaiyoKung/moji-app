# Coding Style Rules

## Imports

- Do NOT import React explicitly — JSX works without it in this project.
- Import UI primitives from `../../components/ui/` (relative path from feature), NOT from `@gluestack-ui/...`.
- Group imports: RN/Expo → third-party libs → internal libs/api → components → features → local files.
- Use `import type` for type-only imports.

## Components

- Use **named exports** for all feature components: `export function MyFeature()`.
- Screen files under `src/app/` use `export default function`.
- Never nest component definitions inside another component function.
- Sub-components in the same file are fine — define them above the main component.
- Always define props as `export interface MyComponentProps { ... }` — use `interface` even when deriving (not inline type, not `type`).
- Use `const handleFoo = () => {}` arrow functions for handlers and helpers inside components — not `function foo() {}` declarations.
- Do NOT add JSX inline comments (`{/* Section Name */}`) inside JSX trees.
- Compound components (subcomponents of same concept) are exported from the same `index.tsx` file.

## Navigation

- Always use `useRouter()` hook for navigation — never `import { router } from "expo-router"` static import.
- `useRouter()` must be called at the **top level** of a component, never conditionally.
- Read route params with `useLocalSearchParams()` and validate immediately after:
  ```ts
  const { id } = useLocalSearchParams();
  if (typeof id !== "string") throw new Error("Invalid id parameter.");
  ```

## Screen Split Pattern

When a screen's primary content depends on a query result, split into two functions:

1. **Default export** = loading shell — handles `isLoading` / `isError` / `undefined`, then renders inner component.
2. **Named inner function** = content component — receives typed, non-nullable data as props. No `?.` needed inside it.

```tsx
function TransactionDetailsContent({ data }: { data: TransactionWithCategory }) {
  const router = useRouter();
  // all mutations and handlers here — data is always defined
}

export default function TransactionDetails() {
  const transactionQuery = useQuery({ ... });
  if (transactionQuery.isLoading) return <Center><Spinner /></Center>;
  if (transactionQuery.isError) return <Center><Text className="text-error-500">...</Text></Center>;
  if (transactionQuery.data === undefined) return <Center><Text>ไม่พบข้อมูล</Text></Center>;
  return <TransactionDetailsContent data={transactionQuery.data} />;
}
```

Exempt: screens where query data is supplementary (form enhancement) or each feature component handles its own loading state.

## State

- **`useState` must always have an explicit type parameter**: `useState<string>("")`, `useState<boolean>(false)`, `useState<MyType | undefined>(undefined)`.
- Never rely on TypeScript inference for `useState` — always annotate even for primitives.

## Lists & FlatList

- **Inverted chat/log lists — prepend new items, do not reverse the array.**
  Use `FlatList` with `inverted` prop. Add new items to the front: `setMessages(prev => [newItem, ...prev])`. Never do `[...messages].reverse()` on a normal (non-inverted) list — it creates a new array on every render.

## Hooks

- Do NOT use `useCallback` or `useMemo` — use plain functions and values instead.
- Do NOT keep `useRef` unless the ref value is actually used (`.focus()`, `.scrollTo()`, etc.).
- TanStack Query: always use `{ queryKey: [...], queryFn: ... }` object syntax.
- Query variable naming: `const thingQuery = useQuery(...)`, access `.data`, `.isLoading`, `.isError` — never destructure.
- Mutation naming: `const xMutation = useMutation(...)`, call via `xMutation.mutate(payload)`.
- Pending state on buttons: `isDisabled={mutation.isPending}` + `{mutation.isPending ? <ButtonSpinner /> : <ButtonIcon as={SaveIcon} />}`.

## State & Logic

- Capture mutable state values into `const captured = value` before async operations, then use `captured`.
- Combine related state via separate `useState` calls (not one big object).
- Inline type annotations on `useState`: `useState<string>(...)`, `useState<boolean>(false)`.
- Conditional rendering: use `null` for empty branches (not `undefined`, not `false`). Use `&&` for show-only conditions.

## Styling

- Use NativeWind (`className`) for all styling — no inline `style` objects except for dynamic values (colors from data).
- Component style variants: use `tva` from `@gluestack-ui/nativewind-utils/tva`. Define a `const xStyle = tva({ base: "...", variants: { ... } })` outside the component.
- Conditional `className` with ternary is only for interaction state from `Pressable` render props (`pressed`, `focused`).
- No hardcoded hex colors — use `tailwindcss/colors` tokens or Gluestack design tokens.
- Screen background: `bg-background-100`.
- Card background: `bg-background-0`.
- Card border: `border border-outline-200 rounded-2xl`.

## Text & Localization

- UI labels visible to users should be in **Thai** (ข้อความ, ปุ่ม ฯลฯ).
- Error and empty-state messages in Thai.
- Developer-facing strings (console, IDs) stay in English.

## TypeScript

- Avoid `any`. When required by RN FormData hacks, use `as unknown as Blob` and add a comment.
- Mutation `onError` callbacks infer `unknown` automatically — no annotation needed.
- Type narrowing: `error instanceof Error ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง"`.
- Use `Omit` / `Pick` / `React.ComponentProps<typeof X>` to derive types — but still declare them as `interface`, not `type`.
- Environment variables: always access via `import { env } from "../env"` — never `process.env` directly in components.
