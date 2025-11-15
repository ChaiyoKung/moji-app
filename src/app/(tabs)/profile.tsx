import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { SignOutButton } from "../../features/sign-out-button";
import { ProfileDetails } from "../../features/profile-details";
import { AppVersion } from "../../features/app-version";
import { Center } from "../../components/ui/center";
import { useSettingStore } from "../../stores/use-setting-store";
import { ScrollView } from "react-native";
import {
  SwitchRow,
  SwitchRowDescription,
  SwitchRowTitle,
} from "../../components/switch-row";

export default function Profile() {
  const isBalanceHidden = useSettingStore((state) => state.isBalanceHidden);
  const toggleHideBalance = useSettingStore((state) => state.toggleHideBalance);

  const isAutoFocusAmount = useSettingStore((state) => state.isAutoFocusAmount);
  const toggleAutoFocusAmount = useSettingStore(
    (state) => state.toggleAutoFocusAmount
  );

  const isAutoFocusNote = useSettingStore((state) => state.isAutoFocusNote);
  const toggleAutoFocusNote = useSettingStore(
    (state) => state.toggleAutoFocusNote
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background-100">
      <ScrollView>
        <VStack space="4xl" className="p-4">
          <VStack space="md">
            <ProfileDetails />
          </VStack>

          <VStack space="md" className="flex-1">
            <SwitchRow value={isBalanceHidden} onToggle={toggleHideBalance}>
              <SwitchRowTitle>ซ่อนเงินคงเหลือ</SwitchRowTitle>
            </SwitchRow>
            <SwitchRow
              value={isAutoFocusAmount}
              onToggle={toggleAutoFocusAmount}
            >
              <SwitchRowTitle>โฟกัสจำนวนเงินอัตโนมัติ</SwitchRowTitle>
              <SwitchRowDescription>
                เมื่อเลือกประเภทแล้ว ระบบจะโฟกัสช่อง “จำนวนเงิน” อัตโนมัติ
              </SwitchRowDescription>
            </SwitchRow>
            <SwitchRow value={isAutoFocusNote} onToggle={toggleAutoFocusNote}>
              <SwitchRowTitle>โฟกัสบันทึกช่วยจำอัตโนมัติ</SwitchRowTitle>
              <SwitchRowDescription>
                เมื่อกรอกจำนวนเงินแล้ว ระบบจะโพกัสช่อง “บันทึกช่วยจำ” อัตโนมัติ
              </SwitchRowDescription>
            </SwitchRow>
          </VStack>

          <VStack space="md">
            <SignOutButton />
            <Center>
              <AppVersion />
            </Center>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
