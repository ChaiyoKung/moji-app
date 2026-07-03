# G1 — Transaction List FlatList Performance

## Goal

Replace the current `TransactionList` component (which uses `.map()` inside a `ScrollView`) with a single `FlatList` at the home screen level to enable true virtualization and improve scroll performance.

## Success Criteria

- `src/features/transaction-list/` is deleted
- Home screen (`src/app/(tabs)/index.tsx`) owns the transactions query and renders a `FlatList` directly
- All header content (balance summary, expense card, calendar, heading) is in `ListHeaderComponent`
- Loading, error, and empty states are handled via `ListEmptyComponent`
- `SwipeableTransactionItem` is NOT wrapped with `React.memo` (memoization is prohibited by project rules)
- The outer `ScrollView` is removed from the home screen
- `SafeAreaView` remains as the root; `FlatList` is `flex-1`
- Bottom padding uses `contentContainerClassName="pb-[5.75rem]"`
- No `ItemSeparatorComponent` added

## Out of Scope

- Pagination / infinite scroll
- Changes to `SwipeableTransactionItem` behavior
- Any other screen beyond the home tab
