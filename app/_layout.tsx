import { ErrorBoundaryProps, Stack } from "expo-router";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { Center } from "../components/ui/center";
import { Text } from "../components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon, Heading } from "lucide-react-native";
import React from "react";
import { HStack } from "../components/ui/hstack";
import { PressableProps } from "react-native";
import { Pressable } from "../components/ui/pressable";
import { Icon } from "../components/ui/icon";
import { Box } from "../components/ui/box";

interface BackButtonProps {
  onPress?: PressableProps["onPress"];
}

function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable className="p-2" onPress={onPress}>
      {({ pressed }) => (
        <Icon
          as={ChevronLeftIcon}
          className={pressed ? "text-gray-700" : "text-gray-500"}
        />
      )}
    </Pressable>
  );
}

function BackButtonSpacer() {
  return (
    <Box className="invisible p-2">
      <Icon as={ChevronLeftIcon} />
    </Box>
  );
}

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  return (
    <Center className="flex-1 bg-gray-100 p-4">
      <Text className="text-center text-red-500">{error.message}</Text>
    </Center>
  );
}

export default function RootLayout() {
  const session = false; // TODO: Replace with actual session check logic

  return (
    <GluestackUIProvider>
      <Stack
        screenOptions={{
          header: ({ navigation, route, options, back }) => {
            const label =
              options.headerTitle !== undefined &&
              typeof options.headerTitle === "string"
                ? options.headerTitle
                : options.title !== undefined
                  ? options.title
                  : route.name;

            return (
              <SafeAreaView
                edges={["top"]}
                className="bg-white border-b border-gray-200 rounded-2xl overflow-hidden"
              >
                <HStack className="items-center px-2 py-3">
                  {back ? (
                    <BackButton onPress={navigation.goBack} />
                  ) : (
                    <BackButtonSpacer />
                  )}
                  <Heading
                    className="flex-1 text-center text-gray-500"
                    size="md"
                  >
                    {label}
                  </Heading>
                  <BackButtonSpacer />
                </HStack>
              </SafeAreaView>
            );
          },
        }}
      >
        <Stack.Protected guard={session}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerTitle: "" }} />
        </Stack.Protected>
      </Stack>
    </GluestackUIProvider>
  );
}
