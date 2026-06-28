# Goal G2 — Shared ChatBubble Component

## Summary
Extract the four inline bubble components from `AutoTransactionScreen` into a single reusable `ChatBubble` component at `src/components/chat-bubble/index.tsx`, driven by `align`, `color`, and `variant` props. Then refactor `AutoTransactionScreen` to use `ChatBubble` in place of the old inline components.

## Acceptance Criteria

1. **Component exists** — `src/components/chat-bubble/index.tsx` exports a `ChatBubble` component.
2. **Props contract** — accepts:
   - `align?: "left" | "right"` — defaults to `"left"`; controls self-alignment and the cut corner direction.
   - `color?: "primary" | "error" | "warn" | "default"` — defaults to `"primary"`.
   - `variant?: "solid" | "outline"` — defaults to `"solid"`.
   - `children: React.ReactNode`
3. **Styling via `tva`** — variants implemented with `tva` from `@gluestack-ui/nativewind-utils/tva`; no inline ternary for color/variant logic.
4. **Corner rounding** — `align="right"` → `rounded-tr-sm`; `align="left"` → `rounded-tl-sm`; both have `rounded-2xl` on all other corners.
5. **Color × variant matrix**:
   - `primary + solid` → `bg-primary-500`, no border (replaces `UserBubble`)
   - `default + solid` → `bg-background-100 border border-outline-200` (replaces `LoadingBubble` shell)
   - `error + outline` → `bg-background-error border border-error-200` (replaces `ErrorBubble`)
   - `warn + outline` → `bg-background-warning border border-warning-200` (replaces `FailureBubble` shell)
6. **`ChatBubbleText` with context inference** — `ChatBubble` provides `color` and `variant` as style context (via `withStyleContext`). `ChatBubbleText` reads this context via `useStyleContext` and applies the correct text color automatically — callers do NOT need to repeat `color`/`variant` on `ChatBubbleText`. Explicit override props are still accepted.
7. **`ChatBubbleText` tva** — text color variants implemented with `tva` using `parentVariants` (matching `ButtonText` pattern), not a plain record.
8. **Refactor complete** — `LoadingBubble`, `ErrorBubble`, `FailureBubble`, and `UserBubble` (the box part only) in `AutoTransactionScreen` are replaced with `ChatBubble` + `ChatBubbleText`. Callers pass no `color`/`variant` to `ChatBubbleText`.
9. **No regressions** — `pnpm format && pnpm lint && pnpm test` passes.

## Out of Scope
- Adding `ChatBubble` to any screen other than `AutoTransactionScreen`.
- Tail/arrow decorations on bubbles.
- Animation or press states.
