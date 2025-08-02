import { Button, ButtonText } from "../../components/ui/button";
import { useSession } from "../../components/session-provider";
import { useMutation } from "@tanstack/react-query";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { logout } from "../../libs/api";
import { getStorageItemAsync } from "../../hooks/use-storage-state";
import { useAppToast } from "../../hooks/use-app-toast";

export function SignOutButton() {
  const { signOut } = useSession();
  const toast = useAppToast();

  const signOutMutation = useMutation({
    mutationFn: GoogleSignin.signOut,
    onSuccess: async () => {
      try {
        const refreshToken = await getStorageItemAsync("refreshToken");
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
      className="rounded-2xl"
      isDisabled={signOutMutation.isPending}
      onPress={() => signOutMutation.mutate()}
    >
      <ButtonText>ออกจากระบบ</ButtonText>
    </Button>
  );
}
