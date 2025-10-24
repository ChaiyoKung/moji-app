import { Tabs } from "expo-router";
import { HStack } from "../../components/ui/hstack";
import { Text } from "../../components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../components/ui/icon";
import {
  ChartNoAxesColumnIcon,
  CircleUserRoundIcon,
  NotebookPenIcon,
  ShieldAlertIcon,
} from "lucide-react-native";
import { VStack } from "../../components/ui/vstack";
import { Pressable } from "../../components/ui/pressable";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, descriptors, navigation }) => {
        return (
          <SafeAreaView
            edges={["bottom"]}
            className="overflow-hidden rounded-t-2xl border-t border-outline-200 bg-background-0"
          >
            <HStack>
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                const label =
                  options.tabBarLabel !== undefined &&
                  typeof options.tabBarLabel === "string"
                    ? options.tabBarLabel
                    : options.title !== undefined
                      ? options.title
                      : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                };

                const onLongPress = () => {
                  navigation.emit({
                    type: "tabLongPress",
                    target: route.key,
                  });
                };

                const iconComponent =
                  route.name === "index"
                    ? NotebookPenIcon
                    : route.name === "dashboard"
                      ? ChartNoAxesColumnIcon
                      : route.name === "profile"
                        ? CircleUserRoundIcon
                        : ShieldAlertIcon;

                return (
                  <Pressable
                    key={route.key}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarButtonTestID}
                    className="flex-1 pb-2 pt-3"
                  >
                    {({ pressed }) => {
                      const textColor = isFocused
                        ? "text-primary-500"
                        : pressed
                          ? "text-typography-700"
                          : "text-typography-500";

                      return (
                        <VStack space="xs" className="items-center">
                          <Icon
                            as={iconComponent}
                            size="xl"
                            className={textColor}
                          />
                          <Text size="sm" className={textColor}>
                            {label}
                          </Text>
                        </VStack>
                      );
                    }}
                  </Pressable>
                );
              })}
            </HStack>
          </SafeAreaView>
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: "บันทึก" }} />
      <Tabs.Screen name="dashboard" options={{ title: "สรุป" }} />
      <Tabs.Screen name="profile" options={{ title: "โปรไฟล์" }} />
    </Tabs>
  );
}
