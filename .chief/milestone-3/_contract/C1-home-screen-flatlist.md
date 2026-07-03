# C1 — Home Screen FlatList Contract

## Screen Structure

```
SafeAreaView (edges=["top"], flex-1, bg-background-100)
├── FlatList<TransactionWithCategory>
│   ├── data: TransactionWithCategory[]
│   ├── keyExtractor: (item) => item._id
│   ├── renderItem: ({ item }) => <SwipeableTransactionItem data={item} />
│   ├── ListHeaderComponent: <HomeHeader /> (see below)
│   ├── ListEmptyComponent: <HomeEmpty /> (see below)
│   ├── className="flex-1"
│   └── contentContainerClassName="pb-[5.75rem]"
├── AddIncomeFab
├── AddExpenseFab
└── AccountBalanceSetupModal
```

## ListHeaderComponent — `HomeHeader`

Inlined sub-component defined above `Home` in the same file.

Contains (in order, wrapped in `VStack space="md" className="p-4"`):
1. `<AccountBalanceSummary />`
2. `<ExpenseSummaryCard date={selectedDate} />`
3. `VStack` with optional `TodayButton` + `TransactionCalendar`
4. `Heading` — "รายการ" (size="lg", bold, className="text-typography-500")

## ListEmptyComponent — `HomeEmpty`

Inlined sub-component defined above `Home` in the same file.
Accepts props: `{ isLoading: boolean; isError: boolean; selectedDate: string }`

Renders:
- `isLoading` → `<Center className="h-40 px-4"><Spinner /></Center>`
- `isError` → `<Center className="h-40 px-4"><Text className="text-error-500">ไม่สามารถโหลดรายการได้</Text></Center>`
- empty → `<Center className="h-40 px-4"><Text className="text-typography-500">{`ไม่พบรายการใน${fromNowDate(selectedDate)}`}</Text></Center>`

## Query

- `queryKey: ["transactions", selectedDate]`
- `queryFn: () => getAllTransactions({ startDate: selectedDate, endDate: selectedDate, timezone: dayjs.tz.guess() })`
- `data` falls back to `[]` when undefined: `transactionsQuery.data ?? []`

## Deleted

- `src/features/transaction-list/` — entire folder removed
