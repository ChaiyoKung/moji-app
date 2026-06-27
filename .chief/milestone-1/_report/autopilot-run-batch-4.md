# Autopilot Run Batch 4

## Mode
auto

## Summary
Refactored all milestone-1 code to comply with the standard rules. Three violations were found and fixed:
1. `useCallback` removed from `use-image-picker.ts` (rule: no `useCallback`/`useMemo`).
2. `types.ts` sub-file deleted from `src/features/auto-transaction/`; all types inlined into `index.tsx` (rule: one file per feature folder).
3. Hardcoded hex/rgb color literals replaced with `tailwindcss/colors` token in `placeholderTextColor` (rule: no hardcoded hex colors).

## Tasks Completed
- task-refactor-1: Remove `useCallback` from `src/hooks/use-image-picker.ts` — converted `const pickImage = useCallback(() => { ... }, [onPick])` to a plain arrow function.
- task-refactor-2: Delete `src/features/auto-transaction/types.ts` — moved all type declarations (`UserMessage`, `LoadingMessage`, `ResultMessage`, `ErrorMessage`, `ChatMessage`) inline into `index.tsx`. Corrected `ResultMessage.created` from `TransactionWithCategory[]` to `Transaction[]` (the API returns raw transactions; the category join happens at render time in `ResultMessageView`). Consolidated the two separate `import type` from `../../libs/api` into one.
- task-refactor-3: Replace `placeholderTextColor="rgb(156 163 175)"` with `placeholderTextColor={colors.gray[400]}` using `import colors from "tailwindcss/colors"` (matching the pattern used in other feature files). Removed the previously hardcoded `color: "#111827"` from the inline `style` object (was already cleaned in the prior pass).

## Decisions Made
- **Issue:** `ResultMessage.created` had been typed as `TransactionWithCategory[]` after the refactor, but the API contract (C1) returns `Transaction[]` and the category resolution happens at render time in `ResultMessageView`.
- **Options:** Keep `TransactionWithCategory[]` and resolve at send time, or revert to `Transaction[]` and keep resolve at render time.
- **Chosen:** `Transaction[]` — resolve at render time (as originally implemented).
- **Reason:** Keeps the API layer clean; `TransactionWithCategory` is a UI-layer concern only. Consistent with how `ResultMessageView` already works.

## Backlog
None — all milestone-1 goals, acceptance criteria, and standard-rule compliance are met.

## User Action Needed
None.
