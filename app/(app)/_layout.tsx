import { Stack } from "expo-router";

export default function Applayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-transaction" options={{ headerTitle: "" }} />
    </Stack>
  );
}
