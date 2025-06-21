import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/text";
import { Button, ButtonText } from "../../components/ui/button";
import { useSession } from "../../components/session-provider";
import { useMutation } from "@tanstack/react-query";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Profile() {
  const { signOut } = useSession();

  const signOutMutation = useMutation({
    mutationFn: GoogleSignin.signOut,
    onSuccess: () => {
      // Optionally handle success, e.g., navigate to a different screen
      console.log("Signed out successfully");
      signOut();
    },
    onError: (error) => {
      // Handle error, e.g., show a toast or alert
      console.error("Sign out failed:", error);
    },
  });

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <Text>Profile</Text>
      <Button
        className="rounded-2xl"
        isDisabled={signOutMutation.isPending}
        onPress={() => signOutMutation.mutate()}
      >
        <ButtonText>ออกจากระบบ</ButtonText>
      </Button>
    </SafeAreaView>
  );
}
