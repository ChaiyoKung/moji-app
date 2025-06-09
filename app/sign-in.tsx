import { StatusBar } from "expo-status-bar";
import { Button, ButtonText } from "../components/ui/button";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Center } from "../components/ui/center";
import { Image } from "../components/ui/image";

export default function SignIn() {
  return (
    <SafeAreaView edges={["top"]} className="flex flex-1 bg-gray-100">
      <Center className="px-6 py-32">
        <Image
          source={require("../assets/moji-logo.png")}
          alt="Moji Logo"
          resizeMode="contain"
          className="w-48 h-48"
        />
      </Center>
      <VStack space="lg" className="flex-1 bg-white p-6 rounded-t-3xl">
        <Heading size="3xl" className="my-4">
          เข้าสู่ระบบ
        </Heading>
        <Button className="rounded-2xl">
          <ButtonText>เข้าสู่ระบบด้วย Google</ButtonText>
        </Button>
        <StatusBar style="auto" />
      </VStack>
    </SafeAreaView>
  );
}
