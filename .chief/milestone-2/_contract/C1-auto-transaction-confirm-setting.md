# C1 — Auto-Transaction Confirm Setting Contract

## Store: `useSettingStore`

Add to `SettingState` interface and store implementation:

```ts
isAutoTransactionConfirm: boolean;       // false = "draft", true = "confirmed"
toggleAutoTransactionConfirm: () => void;
```

- Default: `false`
- Persisted via existing `persist` + `AsyncStorage` setup (no changes to storage key `"setting"`)

## Feature Component: `AutoTransactionConfirmSwitch`

File: `src/features/auto-transaction-confirm-switch/index.tsx`

```tsx
export function AutoTransactionConfirmSwitch() {
  const isAutoTransactionConfirm = useSettingStore((s) => s.isAutoTransactionConfirm);
  const toggleAutoTransactionConfirm = useSettingStore((s) => s.toggleAutoTransactionConfirm);

  return (
    <SwitchRow value={isAutoTransactionConfirm} onToggle={toggleAutoTransactionConfirm}>
      <SwitchRowTitle>AI บันทึกรายการอัตโนมัติ</SwitchRowTitle>
      <SwitchRowDescription>เมื่อเปิดเพื่อบันทึกรายการทันที ปิดเพื่อบันทึกเป็น Draft</SwitchRowDescription>
    </SwitchRow>
  );
}
```

## Profile Page

Add `<AutoTransactionConfirmSwitch />` to `src/app/(tabs)/profile.tsx` inside the existing settings `VStack`, after `<AutoFocusNoteSwitch />`.

## AutoTransactionScreen

In `handleSend`, replace hardcoded `status: "confirmed"` with:

```ts
status: isAutoTransactionConfirm ? "confirmed" : "draft",
```

Where `isAutoTransactionConfirm` is read from `useSettingStore`.
