# Milestone 2 — Auto-Transaction Status Setting TODO

## Phase A — Store + Feature Component

- [x] task-1: Add `isAutoTransactionConfirm` (default `false`) + `toggleAutoTransactionConfirm` to `useSettingStore`
- [x] task-2: Create `src/features/auto-transaction-confirm-switch/index.tsx` — `AutoTransactionConfirmSwitch` component using `SwitchRow` pattern

## Phase B — Wire Up

- [x] task-3: Add `<AutoTransactionConfirmSwitch />` to profile page after `<AutoFocusNoteSwitch />`
- [x] task-4: Replace hardcoded `status: "confirmed"` in `AutoTransactionScreen` with value derived from `useSettingStore`

## Phase C — API Version Display

- [x] task-5: Add `ApiVersionResponse` interface + `getApiVersion()` function to `src/libs/api.ts`
- [x] task-6: Create `src/features/api-version/index.tsx` — `ApiVersion` component via `useQuery`; update profile screen to show `<AppVersion /> • <ApiVersion />` inline
