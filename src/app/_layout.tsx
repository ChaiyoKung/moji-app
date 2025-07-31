import { ErrorBoundaryProps, Stack } from "expo-router";
import { GluestackUIProvider } from "../components/ui/gluestack-ui-provider";
import { Center } from "../components/ui/center";
import { Text } from "../components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "lucide-react-native";
import { HStack } from "../components/ui/hstack";
import { PressableProps } from "react-native";
import { Pressable } from "../components/ui/pressable";
import { Icon } from "../components/ui/icon";
import { Box } from "../components/ui/box";
import { SplashScreenController } from "../components/splash-screen-controller";
import { SessionProvider, useSession } from "../components/session-provider";
import { HideBalanceProvider } from "../components/hide-balance-context";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Heading } from "../components/ui/heading";
import { ReactNode, useState } from "react";
import { isAxiosError } from "axios";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <GluestackUIProvider>
          <SessionProvider>
            <HideBalanceProvider>
              <SplashScreenController />
              <QueryProvider>
                <RootNavigation />
              </QueryProvider>
            </HideBalanceProvider>
          </SessionProvider>
        </GluestackUIProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function QueryProvider({ children }: { children?: ReactNode }) {
  const { signOut } = useSession();
  const [queryClient] = useState<QueryClient>(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // If the error is a 401 Unauthorized, do not retry
              if (isAxiosError(error) && error.response?.status === 401) {
                return false;
              }

              // Retry failed requests up to 3 times
              return failureCount < 3;
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            // If the error is a 401 Unauthorized, sign out the user
            if (isAxiosError(error) && error.response?.status === 401) {
              console.warn("Unauthorized access, signing out...");
              signOut();
              console.log("Signed out successfully due to 401 error");
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function RootNavigation() {
  const { refreshToken } = useSession();
  const hasRefreshToken = Boolean(refreshToken);

  return (
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
                <Heading className="flex-1 text-center text-gray-500" size="md">
                  {label}
                </Heading>
                <BackButtonSpacer />
              </HStack>
            </SafeAreaView>
          );
        },
      }}
    >
      <Stack.Protected guard={hasRefreshToken}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-transaction" options={{ headerTitle: "" }} />
      </Stack.Protected>

      <Stack.Protected guard={!hasRefreshToken}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
