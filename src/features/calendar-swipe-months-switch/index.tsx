import { useSettingStore } from "../../stores/use-setting-store";
import { SwitchRow, SwitchRowTitle } from "../../components/switch-row";

export function CalendarSwipeMonthsSwitch() {
  const isCalendarSwipeMonthsEnabled = useSettingStore(
    (state) => state.isCalendarSwipeMonthsEnabled
  );
  const toggleCalendarSwipeMonthsEnabled = useSettingStore(
    (state) => state.toggleCalendarSwipeMonthsEnabled
  );

  return (
    <SwitchRow
      value={isCalendarSwipeMonthsEnabled}
      onToggle={toggleCalendarSwipeMonthsEnabled}
    >
      <SwitchRowTitle>เลื่อนเดือนในปฏิทินด้วยการปัด</SwitchRowTitle>
    </SwitchRow>
  );
}
