import { useSettingStore } from "../../stores/use-setting-store";
import {
  SwitchRow,
  SwitchRowTitle,
  SwitchRowDescription,
} from "../../components/switch-row";

export function AutoFocusNoteSwitch() {
  const isAutoFocusNote = useSettingStore((state) => state.isAutoFocusNote);
  const toggleAutoFocusNote = useSettingStore(
    (state) => state.toggleAutoFocusNote
  );

  return (
    <SwitchRow value={isAutoFocusNote} onToggle={toggleAutoFocusNote}>
      <SwitchRowTitle>โฟกัสบันทึกช่วยจำอัตโนมัติ</SwitchRowTitle>
      <SwitchRowDescription>
        เมื่อกรอกจำนวนเงินแล้ว ระบบจะโพกัสช่อง “บันทึกช่วยจำ” อัตโนมัติ
      </SwitchRowDescription>
    </SwitchRow>
  );
}
