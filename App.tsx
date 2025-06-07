import "./global.css";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { Text } from "./components/ui/text";
import { Box } from "./components/ui/box";

export default function App() {
  return (
    <GluestackUIProvider>
      <Box className="flex-1 bg-white items-center justify-center">
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </Box>
    </GluestackUIProvider>
  );
}
