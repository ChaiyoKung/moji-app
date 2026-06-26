# Coding Style Rules

## Imports

- Do NOT import React explicitly — JSX works without it in this project.
- Import UI primitives from `../../components/ui/` (relative path from feature), NOT from `@gluestack-ui/...`.
- Group imports: RN/Expo → third-party libs → internal libs/api → components → features → local files.

## Components

- Use **named exports** for all feature components: `export function MyFeature()`.
- Screen files under `src/app/` use `export default function`.
- Never nest component definitions inside another component function.
- Sub-components in the same file are fine — define them above the main component.
- Always define props as `export interface MyComponentProps { ... }` (not inline type).

## Hooks

- `useRouter()` must always be called at the **top level** of a component, never conditionally.
- Prefer `useCallback` only when the function is used as a dependency or passed as a prop.
- TanStack Query: always use `{ queryKey: [...], queryFn: ... }` object syntax.
- Query variable naming: `const thingQuery = useQuery(...)`, access `.data`, `.isLoading`, `.isError`.

## State & Logic

- Capture mutable state values into `const captured = value` before async operations, then use `captured`.
- Combine related state via separate `useState` calls (not one big object).

## Styling

- Use NativeWind (`className`) for all styling — no inline `style` objects except for dynamic values (colors from data).
- Screen background: `bg-background-100`.
- Card background: `bg-background-0`.
- Card border: `border border-outline-200 rounded-2xl`.

## Text & Localization

- UI labels visible to users should be in **Thai** (ข้อความ, ปุ่ม ฯลฯ).
- Error and empty-state messages in Thai.
- Developer-facing strings (console, IDs) stay in English.

## TypeScript

- Avoid `any`. When required by RN FormData hacks, use `as unknown as Blob` and add a comment.
- Prefer `unknown` in catch blocks: `catch (err: unknown)`.
- Type narrowing: `err instanceof Error ? err.message : "ข้อผิดพลาดที่ไม่ทราบสาเหตุ"`.
