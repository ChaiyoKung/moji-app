import { useQuery } from "@tanstack/react-query";
import { getApiVersion } from "../../libs/api";
import { Text } from "../../components/ui/text";

export function ApiVersion() {
  const apiVersionQuery = useQuery({
    queryKey: ["api-version"],
    queryFn: getApiVersion,
  });

  if (apiVersionQuery.isError) {
    return (
      <Text size="xs" className="text-amber-500">
        API ⚠
      </Text>
    );
  }

  if (!apiVersionQuery.data) {
    return null;
  }

  return (
    <Text size="xs" className="text-typography-500">
      API v{apiVersionQuery.data.version}
    </Text>
  );
}
