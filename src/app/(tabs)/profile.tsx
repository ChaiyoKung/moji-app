import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/text";
import { SignOutButton } from "../../features/sign-out-button";
import { VStack } from "../../components/ui/vstack";
import { Heading } from "../../components/ui/heading";
import { Image } from "../../components/ui/image";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../libs/api";
import { env } from "../../env";
import { Spinner } from "../../components/ui/spinner";
import { Center } from "../../components/ui/center";

export default function Profile() {
  const userProfileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100">
      <VStack space="md" className="flex-1 p-4">
        <VStack space="md" className="flex-1 items-center">
          {userProfileQuery.isLoading ? (
            <Center className="w-full h-32">
              <Spinner />
            </Center>
          ) : userProfileQuery.isError ? (
            <Center className="w-full h-32">
              <Text className="text-red-500">
                เกิดข้อผิดพลาดในการโหลดข้อมูลโปรไฟล์
              </Text>
            </Center>
          ) : userProfileQuery.data === undefined ? (
            <Center className="w-full h-32">
              <Text className="text-gray-500">ไม่พบข้อมูลโปรไฟล์ผู้ใช้</Text>
            </Center>
          ) : (
            <>
              <Image
                size="xl"
                source={{
                  uri:
                    userProfileQuery.data?.avatarUrl ??
                    `${env.EXPO_PUBLIC_API_URL}/images/default-avatar.png`,
                }}
                alt="User Avatar"
                className="rounded-full bg-gray-300"
              />
              <VStack className="items-center">
                <Heading>{userProfileQuery.data?.displayName}</Heading>
                <Text className="text-gray-500">
                  {userProfileQuery.data?.email}
                </Text>
              </VStack>
            </>
          )}
        </VStack>
        <SignOutButton />
      </VStack>
    </SafeAreaView>
  );
}
