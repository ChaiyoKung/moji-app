import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "บันทึก" }} />
      <Tabs.Screen name="dashboard" options={{ title: "สรุป" }} />
      <Tabs.Screen name="profile" options={{ title: "โปรไฟล์" }} />
    </Tabs>
  );
}
