# G5 — Refactor autoExtractTransactions to useMutation

## Goal

Replace the manual `try/catch` + `isSending` state pattern in `AutoTransactionScreen`
with a `useMutation` call, bringing it in line with the project's standard mutation pattern.

## Done Criteria

- `autoExtractMutation = useMutation(...)` replaces the direct `autoExtractTransactions(...)` call inside `handleSend`.
- `isSending` state is fully removed; all send-disabled and spinner logic driven by `autoExtractMutation.isPending`.
- Query invalidations (`accounts`, `transactions`, `summary`, `transactionIdsByDate`) moved into `onSuccess` callback.
- Error message appended to `messages` state from `onError` callback.
- No new features introduced; UI and behaviour are identical to before.
