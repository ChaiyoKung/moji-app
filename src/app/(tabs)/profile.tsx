import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { SignOutButton } from "../../features/sign-out-button";
import { ProfileDetails } from "../../features/profile-details";
import { AppVersion } from "../../features/app-version";
import { Center } from "../../components/ui/center";
import { HStack } from "../../components/ui/hstack";
import { Text } from "../../components/ui/text";
import { Switch } from "../../components/ui/switch";
import colors from "tailwindcss/colors";
import { useSettingStore } from "../../stores/use-setting-store";
import { ScrollView } from "react-native";

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
            <HStack
              space="sm"
              className="items-center rounded-2xl border border-gray-300 px-4 py-2"
            >
              <VStack className="flex-1">
                <Text>ซ่อนเงินคงเหลือ</Text>
              </VStack>
              <Switch
                value={isBalanceHidden}
                onToggle={toggleHideBalance}
                trackColor={{
                  false: colors.blue[300],
                  true: colors.blue[500],
                }}
                thumbColor={colors.blue[100]}
                ios_backgroundColor={colors.blue[300]}
              />
            </HStack>
            <HStack
              space="sm"
              className="items-center rounded-2xl border border-gray-300 px-4 py-2"
            >
              <VStack className="flex-1">
                <Text>โฟกัสจำนวนเงินอัตโนมัติ</Text>
                <Text size="xs" className="text-gray-500">
                  เมื่อเลือกประเภทแล้ว ระบบจะโฟกัสช่อง “จำนวนเงิน” อัตโนมัติ
                </Text>
              </VStack>
              <Switch
                value={isAutoFocusAmount}
                onToggle={toggleAutoFocusAmount}
                trackColor={{
                  false: colors.blue[300],
                  true: colors.blue[500],
                }}
                thumbColor={colors.blue[100]}
                ios_backgroundColor={colors.blue[300]}
              />
            </HStack>
            <HStack
              space="sm"
              className="items-center rounded-2xl border border-gray-300 px-4 py-2"
            >
              <VStack className="flex-1">
                <Text>โฟกัสบันทึกช่วยจำอัตโนมัติ</Text>
                <Text size="xs" className="text-gray-500">
                  เมื่อกรอกจำนวนเงินแล้ว ระบบจะโพกัสช่อง “บันทึกช่วยจำ”
                  อัตโนมัติ
                </Text>
              </VStack>
              <Switch
                value={isAutoFocusNote}
                onToggle={toggleAutoFocusNote}
                trackColor={{
                  false: colors.blue[300],
                  true: colors.blue[500],
                }}
                thumbColor={colors.blue[100]}
                ios_backgroundColor={colors.blue[300]}
              />
            </HStack>
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
