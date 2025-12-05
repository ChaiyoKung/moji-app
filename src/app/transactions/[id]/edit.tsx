import { useLocalSearchParams, useRouter } from "expo-router";
import { Heading } from "../../../components/ui/heading";
import { VStack } from "../../../components/ui/vstack";
import { Text } from "../../../components/ui/text";
import { HStack } from "../../../components/ui/hstack";
import { Input, InputField } from "../../../components/ui/input";
import { useState } from "react";
import { SaveIcon } from "lucide-react-native";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "../../../components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategorySelector } from "../../../features/category-selector";
import { AccountBalanceInline } from "../../../features/account-balance-inline";
import { DateLabel } from "../../../components/date-label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Center } from "../../../components/ui/center";
import { Spinner } from "../../../components/ui/spinner";
import {
  getTransactionById,
  TransactionWithCategory,
  updateTransaction,
  UpdateTransactionDto,
} from "../../../libs/api";
import { useAppToast } from "../../../hooks/use-app-toast";
import dayjs from "dayjs";
import { Badge, BadgeText } from "../../../components/ui/badge";

function EditTransactionForm({ data }: { data: TransactionWithCategory }) {
  const queryClient = useQueryClient();
  const toast = useAppToast();
  const router = useRouter();

  const [selectedCatagoryId, setSelectedCatagoryId] = useState<string>(
    data.categoryId._id
  );
  const [amount, setAmount] = useState<string>((data.amount ?? "").toString());
  const [note, setNote] = useState<string>(data.note || "");

  const updateTransactionMutation = useMutation({
    mutationFn: (params: { id: string; data: UpdateTransactionDto }) => {
      const { id, data } = params;
      return updateTransaction(id, data);
    },
    onSuccess: () => {
      console.log("Transaction updated successfully");
      toast.success("แก้ไขรายการสำเร็จ");

      const { _id, date } = data;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions", dayjs(date).format("YYYY-MM-DD")],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary", dayjs(date).format("YYYY-MM-DD")],
      });

      const startOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
      const endOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");
      queryClient.invalidateQueries({
        queryKey: ["transactionIdsByDate", startOfMonth, endOfMonth],
      });

      queryClient.invalidateQueries({ queryKey: ["transaction", _id] });

      router.back();
    },
    onError: (error) => {
      console.error("Error updating transaction:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขรายการ", "กรุณาลองใหม่อีกครั้ง");
    },
  });

  const updateTransactionDraftMutation = useMutation({
    mutationFn: (params: { id: string; data: UpdateTransactionDto }) => {
      const { id, data } = params;
      return updateTransaction(id, data);
    },
    onSuccess: () => {
      console.log("Transaction draft updated successfully");
      toast.success("แก้ไขรายการแบบร่างสำเร็จ");

      const { _id, date } = data;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({
        queryKey: ["transactions", dayjs(date).format("YYYY-MM-DD")],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary", dayjs(date).format("YYYY-MM-DD")],
      });

      const startOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
      const endOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");
      queryClient.invalidateQueries({
        queryKey: ["transactionIdsByDate", startOfMonth, endOfMonth],
      });

      queryClient.invalidateQueries({ queryKey: ["transaction", _id] });

      router.back();
    },
    onError: (error) => {
      console.error("Error updating transaction draft:", error);
      toast.error(
        "เกิดข้อผิดพลาดในการแก้ไขรายการแบบร่าง",
        "กรุณาลองใหม่อีกครั้ง"
      );
    },
  });

  const buildTransaction = (
    status: UpdateTransactionDto["status"]
  ): UpdateTransactionDto => {
    return {
      categoryId: selectedCatagoryId,
      amount: !isNaN(parseInt(amount)) ? parseInt(amount) : undefined,
      note: note.trim() || undefined,
      status,
    };
  };

  const handleSave = () => {
    const newData = buildTransaction("confirmed");
    updateTransactionMutation.mutate({ id: data._id, data: newData });
  };

  const handleSaveDraft = () => {
    const newData = buildTransaction("draft");
    updateTransactionDraftMutation.mutate({ id: data._id, data: newData });
  };

  const isTransactionDraftFormValid = selectedCatagoryId !== "";

  const isTransactionFormValid =
    selectedCatagoryId !== "" &&
    amount.trim() !== "" &&
    !isNaN(parseInt(amount)) &&
    parseInt(amount) > 0;

  const isTransactionPending =
    updateTransactionMutation.isPending ||
    updateTransactionDraftMutation.isPending;

  const isDraftButtonDisabled =
    !isTransactionDraftFormValid || isTransactionPending;

  const isSaveButtonDisabled = !isTransactionFormValid || isTransactionPending;

  return (
    <>
      <KeyboardAwareScrollView className="flex-1 bg-background-100">
        <VStack space="md" className="p-4">
          {data.status === "draft" && (
            <Badge variant="outline" action="warning" size="lg">
              <BadgeText>Draft</BadgeText>
            </Badge>
          )}

          <VStack>
            <Heading size="3xl">
              {data.type === "income" ? "แก้ไขรายรับ" : "แก้ไขรายจ่าย"}
            </Heading>
            <Text className="text-typography-black">ID: {data._id}</Text>
            <DateLabel date={data.date} />
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold>
              ประเภท
            </Heading>
            <CategorySelector
              type={data.type}
              value={selectedCatagoryId}
              onChange={(item) => {
                setSelectedCatagoryId(item._id);
              }}
            />
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold>
              จำนวนเงิน
            </Heading>
            <Input size="xl" className="rounded-2xl">
              <InputField
                type="text"
                placeholder="0"
                value={amount}
                onChangeText={(text) => setAmount(text)}
                keyboardType="numeric"
              />
            </Input>
            <HStack space="xs" className="items-baseline">
              <Text className="text-secondary-500">เงินคงเหลือ</Text>
              <AccountBalanceInline />
            </HStack>
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold>
              บันทึกช่วยจำ
            </Heading>
            <Input size="xl" className="rounded-2xl">
              <InputField
                type="text"
                placeholder="เพิ่มข้อความ..."
                value={note}
                onChangeText={(text) => setNote(text)}
              />
            </Input>
          </VStack>
        </VStack>
      </KeyboardAwareScrollView>

      <SafeAreaView
        edges={["bottom"]}
        className="overflow-hidden rounded-t-2xl border-t border-outline-200 bg-background-0 p-4"
      >
        <VStack space="md">
          <Button
            variant="outline"
            action="secondary"
            size={"sm"}
            onPress={handleSaveDraft}
            isDisabled={isDraftButtonDisabled}
          >
            {updateTransactionDraftMutation.isPending ? (
              <ButtonSpinner />
            ) : (
              <ButtonIcon as={SaveIcon} />
            )}
            <ButtonText>บันทึกแบบ Draft</ButtonText>
          </Button>
          <Button
            size="xl"
            onPress={handleSave}
            isDisabled={isSaveButtonDisabled}
          >
            {updateTransactionMutation.isPending ? (
              <ButtonSpinner />
            ) : (
              <ButtonIcon as={SaveIcon} />
            )}
            <ButtonText>บันทึก</ButtonText>
          </Button>
        </VStack>
      </SafeAreaView>
    </>
  );
}

export default function EditTransaction() {
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

  return <EditTransactionForm data={transactionQuery.data} />;
}
