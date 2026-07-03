import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { HStack } from "../../components/ui/hstack";
import { Text } from "../../components/ui/text";
import { SignOutButton } from "../../features/sign-out-button";
import { ProfileDetails } from "../../features/profile-details";
import { AppVersion } from "../../features/app-version";
import { ApiVersion } from "../../features/api-version";
import { Center } from "../../components/ui/center";
import { ScrollView } from "react-native";
import { HideBalanceSwitch } from "../../features/hide-balance-switch";
import { CalendarSwipeMonthsSwitch } from "../../features/calendar-swipe-months-switch";
import { TransactionSwipeSwitch } from "../../features/transaction-swipe-switch";
import { AutoFocusAmountSwitch } from "../../features/auto-focus-amount-switch";
import { AutoFocusNoteSwitch } from "../../features/auto-focus-note-switch";
import { AutoTransactionConfirmSwitch } from "../../features/auto-transaction-confirm-switch";

export default function Profile() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background-100">
      <ScrollView>
        <VStack space="4xl" className="p-4">
          <VStack space="md">
            <ProfileDetails />
          </VStack>

          <VStack space="md" className="flex-1">
            <HideBalanceSwitch />
            <CalendarSwipeMonthsSwitch />
            <TransactionSwipeSwitch />
            <AutoFocusAmountSwitch />
            <AutoFocusNoteSwitch />
            <AutoTransactionConfirmSwitch />
          </VStack>

          <VStack space="md">
            <SignOutButton />
            <Center>
              <HStack space="xs" className="items-center">
                <AppVersion />
                <Text size="xs" className="text-typography-500">
                  •
                </Text>
                <ApiVersion />
              </HStack>
            </Center>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
