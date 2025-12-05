import { useLocalSearchParams, useRouter } from "expo-router";
import { Heading } from "../../../components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { VStack } from "../../../components/ui/vstack";
import { Text } from "../../../components/ui/text";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTransaction,
  getTransactionById,
  TransactionWithCategory,
} from "../../../libs/api";
import { Center } from "../../../components/ui/center";
import { Spinner } from "../../../components/ui/spinner";
import { CategoryChip } from "../../../components/category-chip";
import { HStack } from "../../../components/ui/hstack";
import { Box } from "../../../components/ui/box";
import dayjs from "dayjs";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "../../../components/ui/button";
import { EditIcon, Trash2 } from "lucide-react-native";
import { Divider } from "../../../components/ui/divider";
import { DateLabel } from "../../../components/date-label";
import { useState } from "react";
import { DeleteAlertDialog } from "../../../components/delete-alert-dialog";
import { useAppToast } from "../../../hooks/use-app-toast";
import { Badge, BadgeText } from "../../../components/ui/badge";

function TransactionDetailsContent({
  data,
}: {
  data: TransactionWithCategory;
}) {
  const queryClient = useQueryClient();
  const toast = useAppToast();
  const router = useRouter();

  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(false);
  const handleShowAlertDialog = () => setShowAlertDialog(true);
  const handleCloseAlertDialog = () => setShowAlertDialog(false);

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactionIdsByDate"] });
      toast.success("ลบรายการเรียบร้อยแล้ว");
      router.back();
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error);
      toast.error("ไม่สามารถลบรายการได้", "กรุณาลองใหม่อีกครั้ง");
    },
  });

  const handlePressEdit = () => {
    router.push({
      pathname: "/transactions/[id]/edit",
      params: { id: data._id },
    });
  };

  const handleDeleteTransaction = () => {
    deleteTransactionMutation.mutateAsync(data._id);
    handleCloseAlertDialog();
  };

  return (
    <>
      <SafeAreaView edges={["bottom"]} className="flex-1 bg-background-100">
        <ScrollView>
          <VStack space="md" className="p-4">
            {data.status === "draft" && (
              <Badge variant="outline" action="warning" size="lg">
                <BadgeText>Draft</BadgeText>
              </Badge>
            )}

            <VStack>
              <Heading size="3xl">
                {data.type === "income"
                  ? "รายละเอียดรายรับ"
                  : "รายละเอียดรายจ่าย"}
              </Heading>
              <Text className="text-typography-black">ID: {data._id}</Text>
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
                <Text size="xl">{data.amount}</Text>
              </Box>
            </VStack>

            {data.note ? (
              <VStack space="sm">
                <Heading size="md" bold>
                  บันทึกช่วยจำ
                </Heading>
                <Box className="rounded-2xl border border-gray-300 px-4 py-2">
                  <Text size="xl">{data.note}</Text>
                </Box>
              </VStack>
            ) : null}
          </VStack>

          <Divider className="my-4" />

          <VStack space="md" className="p-4">
            <VStack space="sm">
              <Text size="sm" className="text-typography-500">
                อัปเดตล่าสุด:{" "}
                {dayjs(data.updatedAt).format("D MMM YYYY, HH:mm")}
              </Text>
              <HStack space="md">
                <Button
                  action="secondary"
                  className="flex-1"
                  onPress={handlePressEdit}
                >
                  <ButtonIcon as={EditIcon} />
                  <ButtonText>แก้ไข</ButtonText>
                </Button>
                <Button
                  variant="outline"
                  action="negative"
                  onPress={handleShowAlertDialog}
                  isDisabled={deleteTransactionMutation.isPending}
                >
                  {deleteTransactionMutation.isPending ? (
                    <ButtonSpinner />
                  ) : (
                    <ButtonIcon as={Trash2} />
                  )}
                  <ButtonText>ลบ</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>

      <DeleteAlertDialog
        title="ยืนยันการลบรายการ"
        description="การลบรายการนี้จะเป็นการลบถาวรและไม่สามารถกู้คืนได้ กรุณายืนยันว่าคุณต้องการดำเนินการต่อ"
        isOpen={showAlertDialog}
        onClose={handleCloseAlertDialog}
        onDelete={handleDeleteTransaction}
      />
    </>
  );
}

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

  return <TransactionDetailsContent data={transactionQuery.data} />;
}
