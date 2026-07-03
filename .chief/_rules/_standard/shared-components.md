# Shared Components Rules

## Always Reuse Before Creating

Search `src/components/` before building a new primitive. Key shared components:

| Component | Path | Use for |
|---|---|---|
| `AmountText` | `src/components/amount-text/` | ANY monetary amount display (income/expense coloring + sign built-in) |
| `CategoryChip` | `src/components/category-chip/` | Category pill/tag in selectors and filters |
| `TransactionItem` | `src/components/transaction-item/` | Displaying a confirmed/draft transaction row |
| `DateLabel` | `src/components/date-label/` | Human-friendly date strings with relative hints |
| `SummaryCard` | `src/components/summary-card/` | Stat cards with a header label and centered value |
| `SpaceSeparator` | `src/components/space-separator/` | `ItemSeparatorComponent` for `FlatList`; accepts `gap` prop (`xs`/`sm`/`md`/`lg`/`xl`/`2xl`, default `md`) |
| `Spinner` | `src/components/ui/spinner/` | Loading indicator in any context |
| `Badge`, `BadgeText` | `src/components/ui/badge/` | Status/type labels on cards |
| `Icon` | `src/components/ui/icon/` | Wraps lucide icons with size + color class |

## AmountText

- Use `<AmountText type="income"|"expense" value={amount} bold size="4xl" showSign />` for transaction amounts.
- Never manually format `฿` or sign prefix — `AmountText` + `formatBaht` handles it.
- When `amount` is undefined (draft without extraction), render `<Text>—</Text>` as fallback.

## Category Display in Cards

- Pattern from `TransactionItem`: colored circle + emoji icon inside + name below/beside.
- `<Center className="h-12 w-12 rounded-full" style={{ backgroundColor: category.color }}>`
- `<Text size="2xl">{category.icon}</Text>` inside the circle.
- Always handle missing category with a neutral grey fallback circle.

## Pressable Rows / Cards

- Use `<Pressable>` from `src/components/ui/pressable/` (Gluestack wrapper).
- The `Pressable` wraps the outer container, not just inner content.

## Badge Usage

- Status badge `"Draft"`: `<Badge action="warning" variant="outline"><BadgeText>Draft</BadgeText></Badge>`
- Type badge: `<Badge action="success"|"error" variant="solid"><BadgeText>Income|Expense</BadgeText></Badge>`

## Do NOT Duplicate Logic

- Monetary formatting: `formatBaht` from `src/utils/format-baht.ts` — already used by `AmountText`.
- Date formatting for display: `DateLabel` component or `dayjs().format("D MMMM YYYY")`.
- Router navigation: `useRouter()` from `expo-router` — no custom navigation helpers.

## Feature Folder Structure

- Every feature/component folder contains exactly **one file**: `index.tsx`. No sub-files, no barrel exports from subfolders.
- All logic, sub-components, and helpers live in `index.tsx`.
- Sub-components used only within the feature are defined above the main export in the same file.
