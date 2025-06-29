import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/text";
import { Button, ButtonText } from "../../components/ui/button";
import { useSession } from "../../components/session-provider";
import { useMutation } from "@tanstack/react-query";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { logout } from "../../libs/api";

export default function Profile() {
  const { refreshToken, signOut } = useSession();

  const signOutMutation = useMutation({
    mutationFn: GoogleSignin.signOut,
    onSuccess: async () => {
      // Optionally handle success, e.g., navigate to a different screen
      if (refreshToken) {
        try {
          await logout(refreshToken);
          console.log("Logged out from backend successfully");
        } catch (error) {
          console.error("Failed to logout from backend:", error);
        }
      }

      signOut();
      console.log("Signed out successfully");
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
