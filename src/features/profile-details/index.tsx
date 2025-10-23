import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../libs/api";
import { env } from "../../env";
import { Center } from "../../components/ui/center";
import { Spinner } from "../../components/ui/spinner";
import { Text } from "../../components/ui/text";
import { Image } from "../../components/ui/image";
import { VStack } from "../../components/ui/vstack";
import { Heading } from "../../components/ui/heading";

const defaultAvatarUrl = `${env.EXPO_PUBLIC_API_URL}/images/default-avatar.png`;

export function ProfileDetails() {
  const userProfileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  if (userProfileQuery.isLoading) {
    return (
      <Center className="h-32 w-full">
        <Spinner />
      </Center>
    );
  }

  if (userProfileQuery.isError) {
    return (
      <Center className="h-32 w-full">
        <Text className="text-error-500">
          เกิดข้อผิดพลาดในการโหลดข้อมูลโปรไฟล์
        </Text>
      </Center>
    );
  }

  if (userProfileQuery.data === undefined) {
    return (
      <Center className="h-32 w-full">
        <Text className="text-typography-500">ไม่พบข้อมูลโปรไฟล์ผู้ใช้</Text>
      </Center>
    );
  }

  return (
    <VStack space="md" className="items-center">
      <Image
        size="xl"
        source={{
          uri: userProfileQuery.data.avatarUrl ?? defaultAvatarUrl,
        }}
        alt="User Avatar"
        className="rounded-full bg-background-300"
      />
      <VStack className="items-center">
        <Heading>{userProfileQuery.data.displayName}</Heading>
        <Text className="text-typography-500">{userProfileQuery.data.email}</Text>
      </VStack>
    </VStack>
  );
}
