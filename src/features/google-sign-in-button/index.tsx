import { Button, ButtonSpinner, ButtonText } from "../../components/ui/button";
import { useSession } from "../../components/session-provider";
import { useAppToast } from "../../hooks/use-app-toast";
import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "../../libs/api";
import { env } from "../../env";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import React from "react";

// Configure Google Signin once per app load
GoogleSignin.configure({
  webClientId: env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID,
  iosClientId: env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID,
  offlineAccess: true,
});

export function GoogleSignInButton() {
  const { signIn } = useSession();
  const toast = useAppToast();

  const signInGoogleMutation = useMutation({
    mutationFn: async () => {
      await GoogleSignin.hasPlayServices();
      const googleSignInResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(googleSignInResponse)) {
        const idToken = googleSignInResponse.data.idToken;
        if (!idToken) {
          throw new Error("Google Sign-In failed: No ID token received.");
        }
        return signInWithGoogle(idToken);
      } else {
        // sign in was cancelled by user
        console.log("Sign in cancelled");
        return null;
      }
    },
    onSuccess: (data) => {
      if (!data) {
        console.warn("Google Sign-In was cancelled or failed.");
        return;
      }
      console.log("Google Sign-In Success");
      signIn(data.user._id, data.accessToken, data.refreshToken);
      router.replace("/");
    },
    onError: (error) => {
      console.error("Google Sign-In failed:", error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            toast.error(
              "ไม่พบ Google Play Services",
              "กรุณาอัปเดต Google Play Services"
            );
            break;
          default:
            toast.error("เข้าสู่ระบบไม่สำเร็จ", "กรุณาลองใหม่อีกครั้ง");
        }
      } else {
        toast.error(
          "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
          "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
        );
      }
    },
  });

  return (
    <Button
      isDisabled={signInGoogleMutation.isPending}
      onPress={() => signInGoogleMutation.mutate()}
    >
      {signInGoogleMutation.isPending && <ButtonSpinner />}
      <ButtonText>เข้าสู่ระบบด้วย Google</ButtonText>
    </Button>
  );
}
