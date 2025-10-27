import { SplashScreen } from "expo-router";
import { useSessionStore } from "../../hooks/use-session-store";

export function SplashScreenController() {
  const isLoading = useSessionStore((state) => state.isLoading);

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
