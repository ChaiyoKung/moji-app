import { ErrorBoundaryProps, Stack } from "expo-router";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { Center } from "../components/ui/center";
import { Text } from "../components/ui/text";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  return (
    <Center className="flex-1 bg-gray-100 p-4">
      <Text className="text-center text-red-500">{error.message}</Text>
    </Center>
  );
}

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
