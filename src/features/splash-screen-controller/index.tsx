import { SplashScreen } from "expo-router";
import { useSessionStore } from "../../hooks/use-session-store";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const isLoading = useSessionStore((state) => state.isLoading);

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
