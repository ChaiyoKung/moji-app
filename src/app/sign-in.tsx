import { GoogleSignInButton } from "../components/google-sign-in-button";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Center } from "../components/ui/center";
import { Image } from "../components/ui/image";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignIn() {
  return (
    <KeyboardAwareScrollView className="flex-1 bg-gray-100">
      <SafeAreaView edges={["top"]}>
        <Center className="px-6 py-20">
          <Image
            source={require("../../assets/moji-logo.png")}
            alt="Moji Logo"
            resizeMode="contain"
            className="w-48 h-48"
          />
        </Center>
      </SafeAreaView>

      <SafeAreaView edges={["bottom"]}>
        <VStack
          space="lg"
          className="bg-white p-6 rounded-t-3xl border-t border-gray-200 h-full"
        >
          <Heading size="3xl" className="my-4 text-typography-black">
            เข้าสู่ระบบ
          </Heading>

          <GoogleSignInButton />
        </VStack>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
