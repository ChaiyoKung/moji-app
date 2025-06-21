import { StatusBar } from "expo-status-bar";
import { Button, ButtonSpinner, ButtonText } from "../components/ui/button";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Center } from "../components/ui/center";
import { Image } from "../components/ui/image";
import { useSession } from "../components/session-provider";
import { router } from "expo-router";
import { useState } from "react";
import { Input, InputField } from "../components/ui/input";
import { Divider } from "../components/ui/divider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation } from "@tanstack/react-query";
import colors from "tailwindcss/colors";
import { api } from "../libs/axios";
import { env } from "../env";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: env.EXPO_PUBLIC_GOOGLE_SIGNIN_WEB_CLIENT_ID,
  iosClientId: env.EXPO_PUBLIC_GOOGLE_SIGNIN_IOS_CLIENT_ID,
  offlineAccess: true,
});

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      signIn(data.accessToken);
      // Navigate after signing in. You may want to tweak this to ensure sign-in is
      // successful before navigating.
      router.replace("/");
    },
    onError: (error) => {
      // Handle error, e.g., show a toast or alert
      console.error("Login failed:", error);
    },
  });

  const signInGoogleMutation = useMutation({
    mutationFn: async () => {
      await GoogleSignin.hasPlayServices();
      const googleSignInResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(googleSignInResponse)) {
        const response = await api.post<{ accessToken: string }>(
          "/auth/google",
          {
            idToken: googleSignInResponse.data.idToken,
          }
        );
        return response.data;
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
      signIn(data.accessToken);
      // Navigate after signing in. You may want to tweak this to ensure sign-in is
      // successful before navigating.
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
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    },
  });

  return (
    <KeyboardAwareScrollView className="flex-1 bg-gray-100" enableOnAndroid>
      <SafeAreaView edges={["top"]}>
        <Center className="px-6 py-20">
          <Image
            source={require("../../assets/moji-logo.png")}
            alt="Moji Logo"
            resizeMode="contain"
            className="w-48 h-48"
          />
        </Center>
        <VStack
          space="lg"
          className="bg-white p-6 rounded-t-3xl border-t border-gray-200 h-full"
        >
          <Heading size="3xl" className="my-4 text-typography-black">
            เข้าสู่ระบบ
          </Heading>

          <VStack space="md">
            <Input className="rounded-2xl">
              <InputField
                type="text"
                placeholder="อีเมล"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Input>

            <Input className="rounded-2xl">
              <InputField
                type="password"
                placeholder=" รหัสผ่าน"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </Input>

            <Button
              className="rounded-2xl"
              onPress={() => mutation.mutate({ username: email, password })}
            >
              {mutation.isPending && <ButtonSpinner color={colors.gray[500]} />}
              <ButtonText>เข้าสู่ระบบ</ButtonText>
            </Button>

            <Button
              variant="outline"
              className="rounded-2xl"
              onPress={() => router.push("/sign-up")}
            >
              <ButtonText>สมัครสมาชิก</ButtonText>
            </Button>
          </VStack>

          <Divider className="my-4" />

          <Button
            className="rounded-2xl"
            isDisabled={signInGoogleMutation.isPending}
            onPress={() => signInGoogleMutation.mutate()}
          >
            {signInGoogleMutation.isPending && <ButtonSpinner />}
            <ButtonText>เข้าสู่ระบบด้วย Google</ButtonText>
          </Button>

          <StatusBar style="auto" />
        </VStack>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
