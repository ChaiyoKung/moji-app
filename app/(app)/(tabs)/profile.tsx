import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../../components/ui/text";
import { Button, ButtonText } from "../../../components/ui/button";
import { useSession } from "../../../components/session-provider";

export default function Profile() {
  const { signOut } = useSession();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <Text>Profile</Text>
      <Button
        className="rounded-2xl"
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}
      >
        <ButtonText>ออกจากระบบ</ButtonText>
      </Button>
    </SafeAreaView>
  );
}
