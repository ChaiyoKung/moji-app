import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { SignOutButton } from "../../features/sign-out-button";
import { ProfileDetails } from "../../features/profile-details";
import { AppVersion } from "../../features/app-version";
import { Center } from "../../components/ui/center";

export default function Profile() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background-100">
      <VStack space="4xl" className="flex-1 p-4">
        <VStack space="md" className="flex-1">
          <ProfileDetails />
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
