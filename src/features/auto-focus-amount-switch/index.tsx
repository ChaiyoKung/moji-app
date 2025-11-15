import { useSettingStore } from "../../stores/use-setting-store";
import {
  SwitchRow,
  SwitchRowTitle,
  SwitchRowDescription,
} from "../../components/switch-row";

export function AutoFocusAmountSwitch() {
  const isAutoFocusAmount = useSettingStore((state) => state.isAutoFocusAmount);
  const toggleAutoFocusAmount = useSettingStore(
    (state) => state.toggleAutoFocusAmount
  );

  return (
    <SwitchRow value={isAutoFocusAmount} onToggle={toggleAutoFocusAmount}>
      <SwitchRowTitle>โฟกัสจำนวนเงินอัตโนมัติ</SwitchRowTitle>
      <SwitchRowDescription>
        เมื่อเลือกประเภทแล้ว ระบบจะโฟกัสช่อง “จำนวนเงิน” อัตโนมัติ
      </SwitchRowDescription>
    </SwitchRow>
  );
}
