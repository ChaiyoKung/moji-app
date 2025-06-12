import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heading } from "../../components/ui/heading";
import { Pressable } from "../../components/ui/pressable";
import { Icon } from "../../components/ui/icon";
import { ChevronLeftIcon } from "lucide-react-native";
import { HStack } from "../../components/ui/hstack";
import { Box } from "../../components/ui/box";

export default function Applayout() {
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
                  <Pressable className="p-2" onPress={navigation.goBack}>
                    {({ pressed }) => (
                      <Icon
                        as={ChevronLeftIcon}
                        className={pressed ? "text-gray-700" : "text-gray-500"}
                      />
                    )}
                  </Pressable>
                ) : (
                  <Box className="invisible p-2">
                    <Icon as={ChevronLeftIcon} />
                  </Box>
                )}

                <Heading className="flex-1 text-center text-gray-500" size="md">
                  {label}
                </Heading>
                <Box className="invisible p-2">
                  <Icon as={ChevronLeftIcon} />
                </Box>
              </HStack>
            </SafeAreaView>
          );
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-transaction" options={{ headerTitle: "" }} />
    </Stack>
  );
}
