import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../../components/ui/vstack";
import { SignOutButton } from "../../features/sign-out-button";
import { ProfileDetails } from "../../features/profile-details";

export default function Profile() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <VStack space="md" className="flex-1 p-4">
        <VStack space="md" className="flex-1 items-center">
          <ProfileDetails />
        </VStack>
        <SignOutButton />
      </VStack>
    </SafeAreaView>
  );
}
