import { useSettingStore } from "../../stores/use-setting-store";
import {
  SwitchRow,
  SwitchRowTitle,
  SwitchRowDescription,
} from "../../components/switch-row";

export function AutoTransactionConfirmSwitch() {
  const isAutoTransactionConfirm = useSettingStore(
    (state) => state.isAutoTransactionConfirm
  );
  const toggleAutoTransactionConfirm = useSettingStore(
    (state) => state.toggleAutoTransactionConfirm
  );

  return (
    <SwitchRow
      value={isAutoTransactionConfirm}
      onToggle={toggleAutoTransactionConfirm}
    >
      <SwitchRowTitle>AI บันทึกรายการอัตโนมัติ</SwitchRowTitle>
      <SwitchRowDescription>
        เมื่อเปิดเพื่อบันทึกรายการทันที ปิดเพื่อบันทึกเป็น Draft
      </SwitchRowDescription>
    </SwitchRow>
  );
}
