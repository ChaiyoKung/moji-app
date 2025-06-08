import { Stack } from "expo-router";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";

export default function RootLayout() {
  const session = true; // TODO: Replace with actual session check logic

  return (
    <GluestackUIProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={session}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </GluestackUIProvider>
  );
}
