# G1 — Auto-Transaction Status Setting

## Goal

Allow users to control whether AI-extracted transactions are saved as `"confirmed"` or `"draft"` via a toggle on the profile settings page.

## Motivation

The `status` field in `autoExtractTransactions` is currently hardcoded to `"confirmed"`. Users have no way to review AI-extracted transactions before they are committed. A profile-level toggle lets users opt into draft mode.

## Acceptance Criteria

1. A new toggle `AutoTransactionConfirmSwitch` exists in `src/features/auto-transaction-confirm-switch/`.
2. The toggle appears on the profile page alongside the existing switches.
3. The setting is persisted in `useSettingStore` via AsyncStorage (same pattern as existing switches).
4. `AutoTransactionScreen` reads the setting from the store and passes the corresponding `status` value (`"confirmed"` when on, `"draft"` when off) to `autoExtractTransactions`.
5. Default value is `false` (i.e. `"draft"` by default).
6. Existing behavior is preserved for all other features.
