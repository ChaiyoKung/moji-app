# Goal G3 — TransactionItem UI Enhancements

## Summary

Extend `src/components/transaction-item/index.tsx` with two optional display features:
1. An "AI Generated" badge — shown automatically when `data.aiModel` is set.
2. A date display — shown when the caller passes `showDate={true}`.

## Acceptance Criteria

1. **AI Generated badge** — When `data.aiModel` is a non-empty string, a `Badge` with a `Sparkles` icon and text "AI Generated" renders inside the VStack, below the note. No new prop is required; presence of `aiModel` is the sole condition.
2. **Date display** — When `showDate={true}` is passed to `TransactionItem`, `data.date` is rendered as a `Text` in `YYYY-MM-DD` format (via `dayjs`) inside the VStack, below the AI badge (if present).
3. **`showDate` prop** — `TransactionItemProps` gains an optional `showDate?: boolean` field. Defaults to `false` (date hidden by default — all existing callers remain unchanged).
4. **Placement** — Both the AI badge and date text render inside the existing VStack (below note, before row ends). No structural layout changes elsewhere.
5. **No regressions** — `pnpm format && pnpm lint && pnpm test` passes. All existing `TransactionItem` call sites compile without modification.

## Out of Scope
- Toggling the AI badge via a prop.
- Changing the date format beyond `YYYY-MM-DD`.
- Modifying `SwipeableTransactionItem` or any other caller beyond passing `showDate` if desired.
