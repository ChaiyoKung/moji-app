# Contract C7 — TransactionItem UI Enhancements

## Component

`src/components/transaction-item/index.tsx`

## Props Interface Change

```ts
export interface TransactionItemProps {
  data: TransactionWithCategory;
  showDate?: boolean; // NEW — defaults to false
}
```

## AI Generated Badge

### Condition
Render only when `data.aiModel` is a non-empty string (i.e. `!!data.aiModel`).

### Markup
```tsx
{!!data.aiModel && (
  <Badge variant="outline" action="info" className="mt-1 self-start">
    <BadgeIcon as={Sparkles} />
    <BadgeText>AI Generated</BadgeText>
  </Badge>
)}
```

- Uses `BadgeIcon` and `BadgeText` from `src/components/ui/badge`.
- `Sparkles` imported from `lucide-react-native`.
- `action="info"` — consistent with the existing badge style system.
- Placed inside the existing `VStack`, after the note block.

## Date Display

### Condition
Render only when `showDate === true`.

### Markup
```tsx
{showDate && (
  <Text size="sm" className="text-typography-500">
    {dayjs(data.date).format("YYYY-MM-DD")}
  </Text>
)}
```

- `dayjs` already used in the project (`src/components/date-label/index.tsx`).
- Placed after the AI Generated badge (if present).
- `size="sm"` consistent with the existing note text style.

## Layout Order (VStack contents)

1. Draft badge (existing, conditional on `data.status === "draft"`)
2. Category name (existing)
3. Note text (existing, conditional on `data.note`)
4. AI Generated badge (NEW, conditional on `data.aiModel`)
5. Date text (NEW, conditional on `showDate`)

## Imports Added

```ts
import { BadgeIcon } from "../ui/badge";
import { Sparkles } from "lucide-react-native";
import dayjs from "dayjs";
```

## Callers

| File | Change needed |
|---|---|
| `src/features/swipeable-transaction-item/index.tsx` | None — `showDate` defaults to `false` |
| `src/app/(tabs)/auto-transaction.tsx` | None — `showDate` defaults to `false` |

No existing call site requires modification.
