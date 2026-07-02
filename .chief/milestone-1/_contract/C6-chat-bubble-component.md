# Contract C6 — ChatBubble Component

## Location
`src/components/chat-bubble/index.tsx`

## Props Interface

```ts
interface ChatBubbleProps {
  align?: "left" | "right";   // default: "left"
  color?: "primary" | "error" | "warn" | "default"; // default: "primary"
  variant?: "solid" | "outline"; // default: "solid"
  children: React.ReactNode;
}
```

## Context Architecture

`ChatBubble` uses `withStyleContext(View, SCOPE)` as its root to provide `color` and `variant` as style context. `ChatBubbleText` reads this context via `useStyleContext(SCOPE)` and applies text color automatically via `parentVariants` in its tva — matching the `Button` / `ButtonText` pattern exactly.

`SCOPE` constant: `"CHAT_BUBBLE"`

## `ChatBubble` Styling

Implemented via `tva` from `@gluestack-ui/utils/nativewind-utils`. No inline ternary for color/variant logic.

### Base classes (always applied)
```
rounded-2xl px-4 py-3
```

### `align` variant
| Value | Classes added |
|---|---|
| `left` | `self-start rounded-tl-sm` |
| `right` | `self-end rounded-tr-sm` |

### `color × variant` compound variants
| color | variant | Classes |
|---|---|---|
| `primary` | `solid` | `bg-primary-500` |
| `default` | `solid` | `bg-background-100 border border-outline-200` |
| `error` | `outline` | `bg-background-error border border-error-200` |
| `warn` | `outline` | `bg-background-warning border border-warning-200` |
| `primary` | `outline` | `border border-primary-200 bg-background-50` |
| `error` | `solid` | `bg-error-500` |
| `warn` | `solid` | `bg-warning-500` |
| `default` | `outline` | `bg-background-50 border border-outline-200` |

## `ChatBubbleText` Styling

`chatBubbleTextStyle` uses `parentVariants` (not direct variants) to inherit from context:

```ts
const chatBubbleTextStyle = tva({
  base: "",
  parentVariants: {
    color: {
      primary: "text-typography-0",
      error:   "text-error-600",
      warn:    "text-warning-600",
      default: "text-typography-600",
    },
    variant: {
      solid:   "",
      outline: "",
    },
  },
});
```

`ChatBubbleText` also accepts explicit `color` and `variant` override props (same as `ButtonText`). If not passed, parent context values are used.

## `ChatBubbleText` Props Interface

```ts
interface ChatBubbleTextProps {
  color?: "primary" | "error" | "warn" | "default";  // optional override
  variant?: "solid" | "outline";                      // optional override
  children: string;
}
```

## `ChatBubbleSpinner` Styling

`chatBubbleSpinnerStyle` uses `parentVariants` to inherit spinner color from context — same color map as `ChatBubbleText`:

```ts
const chatBubbleSpinnerStyle = tva({
  base: "",
  parentVariants: {
    color: {
      primary: "text-typography-0",
      error:   "text-error-600",
      warn:    "text-warning-600",
      default: "text-typography-600",
    },
  },
});
```

## `ChatBubbleSpinner` Props Interface

```ts
interface ChatBubbleSpinnerProps {
  size?: React.ComponentProps<typeof Spinner>["size"];  // optional, passed to Spinner
}
```

`ChatBubbleSpinner` reads `color` from `useStyleContext(SCOPE)`, computes className via tva, and passes it to `<Spinner>`.

## Usage in AutoTransactionScreen

Callers do NOT pass `color`/`variant` to sub-components — all inferred from parent `ChatBubble`:

| Old component | New equivalent |
|---|---|
| `<UserBubble text={...}>` | `<ChatBubble align="right" color="primary"><ChatBubbleText>{text}</ChatBubbleText></ChatBubble>` |
| `<LoadingBubble>` | `<ChatBubble align="left" color="default"><HStack>...<ChatBubbleSpinner /><ChatBubbleText>...</ChatBubbleText></HStack></ChatBubble>` |
| `<ErrorBubble message={...}>` | `<ChatBubble align="left" color="error" variant="outline"><ChatBubbleText>{message}</ChatBubbleText></ChatBubble>` |
| `<FailureBubble item={...}>` | `<ChatBubble align="left" color="warn" variant="outline"><ChatBubbleText>{...}</ChatBubbleText></ChatBubble>` |
