# Goal G4 — Auto-Extraction Success Triggers Main Screen Data Refresh

## Summary
After `autoExtractTransactions` succeeds, invalidate the same query families that `add-transaction` invalidates so the main screen (home tab) reflects new draft transactions immediately when the user navigates there.

## Acceptance Criteria

1. On `autoExtractTransactions` success, `queryClient.invalidateQueries` is called for all 4 query families: `accounts`, `transactions`, `summary`, `transactionIdsByDate`.
2. Invalidation uses broad prefixes (no date filter) — result may span multiple dates.
3. No UI change — existing chat messages and screen state are unaffected.
4. User stays on the AI tab after extraction — no navigation change.

## Out of Scope
- Narrowing invalidation per-date
- Any change to the draft transaction card or chat UI
