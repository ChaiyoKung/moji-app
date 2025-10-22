import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/text";
import { SignOutButton } from "../../features/sign-out-button";
import { VStack } from "../../components/ui/vstack";
import { Heading } from "../../components/ui/heading";
import { Image } from "../../components/ui/image";

export default function Profile() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <VStack space="md" className="flex-1 p-4">
        <VStack space="md" className="flex-1 items-center">
          <Image
            size="xl"
            source={{
              uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=256",
            }}
            alt="Profile Picture"
            className="rounded-full bg-gray-300"
          />
          <VStack className="items-center">
            <Heading>Display Name</Heading>
            <Text className="text-gray-500">user@example.com</Text>
          </VStack>
        </VStack>
        <SignOutButton />
      </VStack>
    </SafeAreaView>
  );
}
