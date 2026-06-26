# Autopilot Run Batch 2

## Mode
auto

## Summary
Implemented Phase B (real API integration) — image crop picker hook, full send flow connected to `POST /transactions/auto`, category resolution, and draft card navigation. All lint/format/tests pass.

## Tasks Completed
- task-5: Installed `react-native-image-crop-picker` via `pnpm exec expo install`. Created `src/features/auto-transaction/hooks/useImagePicker.ts` with `ActionSheetIOS` on iOS and `Alert.alert` on Android, `CROP_OPTIONS` per contract, `E_PICKER_CANCELLED` handled gracefully. Wired `handleAttach` in screen — sets `imageUri` + `imageMime` in input state.
- task-6: Added `autoExtractTransactions`, `DraftTransaction`, `FailedItem`, `AutoExtractionResponse` to `src/libs/api.ts`. Updated `src/features/auto-transaction/types.ts` to re-export from `api.ts`. Rewrote `handleSend` as full async flow (fetch first account → append UserMessage + LoadingMessage → call API → replace LoadingMessage with ResultMessage or ErrorMessage). Added `useQuery` for accounts + income/expense categories; `DraftTransactionCard.onPress` navigates to `/transactions/${id}/edit`.

## Decisions Made (auto mode only)
- **Issue:** `DraftTransaction`/`FailedItem` were defined in `types.ts` (Phase A) but the established pattern in `api.ts` is to co-locate API response types with their API functions
- **Options:** (a) Keep types in `types.ts`, import into `api.ts`; (b) Move types to `api.ts`, re-export from `types.ts`
- **Chosen:** Option (b) — moved to `api.ts`, re-export from `types.ts`
- **Reason:** Matches existing project pattern; prevents circular imports between `api.ts` and feature modules

## Backlog
None — all milestone goals are now implemented.

## User Action Needed
- **iOS native link required:** Run `npx pod-install` from the project root before running on iOS device/simulator. `react-native-image-crop-picker` uses native iOS frameworks (`Photos`, `PhotosUI`, `AVFoundation`) that must be linked via CocoaPods.
- **Android:** No manual native step needed — a rebuild (`pnpm android`) is sufficient.
