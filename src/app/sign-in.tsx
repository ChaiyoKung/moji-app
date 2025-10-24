import { GoogleSignInButton } from "../features/google-sign-in-button";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Center } from "../components/ui/center";
import { Image } from "../components/ui/image";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignIn() {
  return (
    <KeyboardAwareScrollView className="flex-1 bg-background-100">
      <SafeAreaView edges={["top"]}>
        <Center className="px-6 py-20">
          <Image
            source={require("../../assets/moji-logo.png")}
            alt="Moji Logo"
            resizeMode="contain"
            className="h-48 w-48"
          />
        </Center>
      </SafeAreaView>

      <SafeAreaView edges={["bottom"]}>
        <VStack
          space="lg"
          className="h-full rounded-t-3xl border-t border-outline-200 bg-background-0 p-6"
        >
          <Heading size="3xl" className="my-4">
            เข้าสู่ระบบ
          </Heading>

          <GoogleSignInButton />
        </VStack>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
