import { useSettingStore } from "../../stores/use-setting-store";
import { SwitchRow, SwitchRowTitle } from "../../components/switch-row";

export function HideBalanceSwitch() {
  const isBalanceHidden = useSettingStore((state) => state.isBalanceHidden);
  const toggleHideBalance = useSettingStore((state) => state.toggleHideBalance);

  return (
    <SwitchRow value={isBalanceHidden} onToggle={toggleHideBalance}>
      <SwitchRowTitle>ซ่อนเงินคงเหลือ</SwitchRowTitle>
    </SwitchRow>
  );
}
