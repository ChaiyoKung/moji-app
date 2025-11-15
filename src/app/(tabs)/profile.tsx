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
      <VStack space="4xl" className="flex-1 p-4">
        <VStack space="md">
          <ProfileDetails />
        </VStack>

        <VStack space="md" className="flex-1">
          <HStack className="items-center rounded-2xl border border-gray-300 px-4 py-2">
            <Text className="flex-1">ซ่อนเงินคงเหลือ</Text>
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
          <HStack className="items-center rounded-2xl border border-gray-300 px-4 py-2">
            <Text className="flex-1">โฟกัสจำนวนเงินอัตโนมัติ</Text>
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
          <HStack className="items-center rounded-2xl border border-gray-300 px-4 py-2">
            <Text className="flex-1">โฟกัสบันทึกช่วยจำอัตโนมัติ</Text>
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
    </SafeAreaView>
  );
}
