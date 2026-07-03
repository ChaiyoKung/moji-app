import { useQuery } from "@tanstack/react-query";
import { getApiVersion } from "../../libs/api";
import { Text } from "../../components/ui/text";

export function ApiVersion() {
  const apiVersionQuery = useQuery({
    queryKey: ["version"],
    queryFn: getApiVersion,
  });

  if (apiVersionQuery.isLoading) {
    return (
      <Text size="xs" className="text-typography-500">
        Loading API version...
      </Text>
    );
  }

  if (apiVersionQuery.isError) {
    return (
      <Text size="xs" className="text-amber-500">
        API version not available
      </Text>
    );
  }

  if (!apiVersionQuery.data) {
    return (
      <Text size="xs" className="text-amber-500">
        API version not available
      </Text>
    );
  }

  return (
    <Text size="xs" className="text-typography-500">
      API v{apiVersionQuery.data.version}
    </Text>
  );
}
