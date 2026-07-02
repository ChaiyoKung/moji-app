# Contract C4 — Tab Navigator Changes

## New Tab

Add a fourth tab to `src/app/(tabs)/_layout.tsx`:

| Property | Value |
|---|---|
| Route | `auto` |
| File | `src/app/(tabs)/auto-transaction.tsx` |
| Label | `"Auto"` |
| Icon | `SparklesIcon` from `lucide-react-native` |
| Active color | `text-primary-500` (matches existing active style) |
| Inactive color | `text-typography-300` (matches existing inactive style) |

## Tab Placement

Append as the last tab (after `profile`) unless UX review suggests otherwise. Tab order: `index`, `dashboard`, `profile`, `auto`.

## Screen File

`src/app/(tabs)/auto-transaction.tsx` — renders the `<AutoTransactionScreen />` component (defined in `src/features/auto-transaction/`).
