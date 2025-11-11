import { useLocalSearchParams } from "expo-router";
import { Heading } from "../../components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { VStack } from "../../components/ui/vstack";
import { Text } from "../../components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { getTransactionById } from "../../libs/api";
import { Center } from "../../components/ui/center";
import { Spinner } from "../../components/ui/spinner";
import { CategoryChip } from "../../components/category-chip";
import { AmountText } from "../../components/amount-text";
import { HStack } from "../../components/ui/hstack";
import { Box } from "../../components/ui/box";
import dayjs from "dayjs";
import { Button, ButtonIcon, ButtonText } from "../../components/ui/button";
import { EditIcon, Trash2 } from "lucide-react-native";
import { Divider } from "../../components/ui/divider";
import { DateLabel } from "../../components/date-label";

export default function TransactionDetails() {
  const { id } = useLocalSearchParams();
  if (typeof id !== "string") throw new Error("Invalid id parameter.");

  const transactionQuery = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionById(id),
  });

  if (transactionQuery.isLoading) {
    return (
      <Center className="flex-1 bg-background-100 p-4">
        <Spinner />
        <Text className="mt-2 text-typography-500">กำลังโหลดข้อมูล...</Text>
      </Center>
    );
  }

  if (transactionQuery.isError) {
    return (
      <Center className="flex-1 bg-background-100 p-4">
        <Text className="text-error-500">
          เกิดข้อผิดพลาดในการโหลดข้อมูลรายการ
        </Text>
      </Center>
    );
  }

  if (transactionQuery.data === undefined) {
    return (
      <Center className="flex-1 bg-background-100 p-4">
        <Text className="text-typography-500">ไม่พบข้อมูลรายการ</Text>
      </Center>
    );
  }

  const data = transactionQuery.data;

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background-100">
      <ScrollView>
        <VStack space="md" className="p-4">
          <VStack>
            <Heading size="3xl">
              {data.type === "income"
                ? "รายละเอียดรายรับ"
                : "รายละเอียดรายจ่าย"}
            </Heading>
            <Text className="text-typography-black">ID: {id}</Text>
            <DateLabel date={data.date} />
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold>
              ประเภท
            </Heading>
            <HStack>
              <CategoryChip data={data.categoryId} selected />
            </HStack>
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold>
              จำนวนเงิน
            </Heading>
            <Box className="rounded-2xl border border-gray-300 px-4 py-2">
              <AmountText size="4xl" bold value={data.amount} />
            </Box>
          </VStack>

          {data.note ? (
            <VStack space="sm">
              <Heading size="md" bold>
                บันทึกช่วยจำ
              </Heading>
              <Box className="rounded-2xl border border-gray-300 px-4 py-2">
                <Text size="lg">{data.note}</Text>
              </Box>
            </VStack>
          ) : null}
        </VStack>

        <Divider className="my-4" />

        <VStack space="md" className="p-4">
          <VStack space="sm">
            <Text size="sm" className="text-typography-500">
              อัปเดตล่าสุด: {dayjs(data.updatedAt).format("D MMM YYYY, HH:mm")}
            </Text>
            <HStack space="md">
              <Button action="secondary" className="flex-1">
                <ButtonIcon as={EditIcon} />
                <ButtonText>แก้ไข</ButtonText>
              </Button>
              <Button variant="outline" action="negative">
                <ButtonIcon as={Trash2} />
                <ButtonText>ลบ</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
