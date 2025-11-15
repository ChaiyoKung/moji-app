import { useSettingStore } from "../../stores/use-setting-store";
import {
  SwitchRow,
  SwitchRowTitle,
  SwitchRowDescription,
} from "../../components/switch-row";

export function TransactionSwipeSwitch() {
  const isTransactionSwipeEnabled = useSettingStore(
    (state) => state.isTransactionSwipeEnabled
  );
  const toggleTransactionSwipeEnabled = useSettingStore(
    (state) => state.toggleTransactionSwipeEnabled
  );

  return (
    <SwitchRow
      value={isTransactionSwipeEnabled}
      onToggle={toggleTransactionSwipeEnabled}
    >
      <SwitchRowTitle>ปัดซ้ายเพื่อลบรายการ</SwitchRowTitle>
      <SwitchRowDescription>
        ปัดรายการที่บันทึกไว้ไปทางซ้ายเพื่อแสดงปุ่มลบ
      </SwitchRowDescription>
    </SwitchRow>
  );
}
