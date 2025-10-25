import { Text } from "../../components/ui/text";
import {
  nativeApplicationVersion as version,
  nativeBuildVersion as buildNumber,
} from "expo-application";

export function AppVersion() {
  // show message if both version and build number are not available
  if (version == null && buildNumber == null) {
    return (
      <Text size="xs" className="text-amber-500">
        Version information not available
      </Text>
    );
  }

  // show only version if build number is not available
  if (buildNumber == null) {
    return (
      <Text size="xs" className="text-typography-500">
        Version {version}
      </Text>
    );
  }

  // show only build number if version is not available
  if (version == null) {
    return (
      <Text size="xs" className="text-typography-500">
        Build {buildNumber}
      </Text>
    );
  }

  // show both version and build number
  return (
    <Text size="xs" className="text-typography-500">
      Version {version} (Build {buildNumber})
    </Text>
  );
}
