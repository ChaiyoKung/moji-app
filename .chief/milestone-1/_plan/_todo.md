# Milestone 1 — AI Auto-Extraction Tab TODO

## Phase A — UI (mock data, no real API)

- [x] task-1: Register `auto-transaction` tab in the bottom navigator
- [x] task-2: Build `AutoTransactionScreen` chat UI shell + message feed with mock messages
- [x] task-3: Build draft transaction card, failure bubble, and error bubble components (mock data)
- [x] task-4: Build input action bar (text input + send button + image thumbnail preview)

## Phase B — Integration (real API)

- [x] task-5: Install `react-native-image-crop-picker` + wire up attachment button + crop flow
- [x] task-6: Add `autoExtractTransactions` API function + connect send action to real backend

## Phase C — Bug Fixes (E2E)

- [x] task-7: Fix keyboard covering input bar — replace RN KeyboardAvoidingView with react-native-keyboard-controller's version
- [x] task-8: Move auto-transaction tab to 2nd position and rename label from "Auto" to "AI"

## Phase D — ChatBubble Refactor

- [x] task-9: Create `src/components/chat-bubble/index.tsx` with `align`, `color`, `variant` props via `tva`
- [x] task-10: Refactor `AutoTransactionScreen` — replace inline `LoadingBubble`, `ErrorBubble`, `FailureBubble`, and `UserBubble` box with `ChatBubble`
- [x] task-11: Refactor `ChatBubble` to use `withStyleContext` + provide `color`/`variant` context; refactor `ChatBubbleText` to use `parentVariants` tva + `useStyleContext` (matching `ButtonText` pattern)
- [x] task-12: Update `AutoTransactionScreen` callers — remove explicit `color`/`variant` props from all `ChatBubbleText` usages
- [x] task-13: Add `ChatBubbleSpinner` to `src/components/chat-bubble/index.tsx` — `parentVariants` tva + `useStyleContext`, same color map as `ChatBubbleText`, optional `size` prop
- [x] task-14: Update `LoadingBubble` in `AutoTransactionScreen` — replace `<Spinner size="small" />` with `<ChatBubbleSpinner size="small" />`; remove `Spinner` import if no longer used

## Phase E — TransactionItem Enhancements

- [x] task-15: Add `showDate` prop + AI Generated badge + date display to `TransactionItem`

## Phase F — Data Refresh After Auto-Extraction

- [x] task-16: Invalidate accounts + transactions + summary + transactionIdsByDate queries on autoExtractTransactions success
