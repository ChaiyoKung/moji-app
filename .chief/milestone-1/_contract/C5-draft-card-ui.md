# Contract C5 — Draft Transaction Card UI

## Purpose

Renders a single item from the `created` array inside the `<AutoTransactionScreen />` chat feed. Read-only. Tapping navigates to `src/app/transactions/[id]/edit.tsx`.

## Data Requirements

Before rendering, resolve `categoryId` → `Category` object using the prefetched category list (both `income` and `expense` categories fetched on mount via existing `getAllGategoriesByType` API).

## Display Fields

| Field | Source | Display |
|---|---|---|
| Type badge | `transaction.type` | "Income" (green) or "Expense" (red) coloured badge |
| Amount | `transaction.amount` | Formatted number + currency code (e.g. `"฿960"` or `"960 THB"`); show `"—"` if absent |
| Category | Resolved from `categoryId` | Category name + icon (if available); fallback to `"Unknown"` |
| Date | `transaction.date` | Formatted as `YYYY-MM-DD` using `dayjs` |
| Note | `transaction.note` | Show note text if present; omit row if absent |
| Status badge | `transaction.status` | Always `"Draft"` — use a neutral/amber badge |

## Layout

- Card with rounded corners, subtle border/shadow matching app design language.
- "Draft" badge prominently in top-right corner.
- Entire card is a `Pressable` — tap navigates to edit screen.
- Use existing `Badge`, `Text`, and layout primitives from `src/components/ui/`.

## Navigation

```ts
router.push(`/transactions/${transaction._id}/edit`);
```
