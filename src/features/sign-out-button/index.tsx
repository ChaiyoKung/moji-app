import { Button, ButtonSpinner, ButtonText } from "../../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { logout } from "../../libs/api";
import { useAppToast } from "../../hooks/use-app-toast";
import { useSessionStore } from "../../hooks/use-session-store";

export function SignOutButton() {
  const refreshToken = useSessionStore((state) => state.refreshToken);
  const signOut = useSessionStore((state) => state.signOut);
  const toast = useAppToast();

  const signOutMutation = useMutation({
    mutationFn: GoogleSignin.signOut,
    onSuccess: async () => {
      try {
        if (!refreshToken) {
          console.warn("No refresh token found, skipping backend logout");
          return;
        }
        await logout(refreshToken);
        console.log("Logged out from backend successfully");
      } catch (error) {
        console.error("Failed to logout from backend:", error);
        toast.error(
          "ออกจากระบบไม่สำเร็จ",
          "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
        );
      }
      signOut();
      console.log("Signed out successfully");
    },
    onError: (error) => {
      console.error("Sign out failed:", error);
      toast.error("ออกจากระบบไม่สำเร็จ", "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    },
  });

  return (
    <Button
      variant="outline"
      action="negative"
      isDisabled={signOutMutation.isPending}
      onPress={() => signOutMutation.mutate()}
    >
      {signOutMutation.isPending && <ButtonSpinner />}
      <ButtonText>ออกจากระบบ</ButtonText>
    </Button>
  );
}
