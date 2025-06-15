import { StatusBar } from "expo-status-bar";
import { Button, ButtonText } from "../components/ui/button";
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

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    await signIn(email, password);
    // Navigate after signing in. You may want to tweak this to ensure sign-in is
    // successful before navigating.
    router.replace("/");
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-gray-100" enableOnAndroid>
      <SafeAreaView edges={["top"]}>
        <Center className="px-6 py-20">
          <Image
            source={require("../assets/moji-logo.png")}
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

            <Button className="rounded-2xl" onPress={handleSubmit}>
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

          <Button className="rounded-2xl">
            <ButtonText>เข้าสู่ระบบด้วย Google</ButtonText>
          </Button>

          <StatusBar style="auto" />
        </VStack>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
