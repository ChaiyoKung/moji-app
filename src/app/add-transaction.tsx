import { router, useLocalSearchParams } from "expo-router";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { Text } from "../components/ui/text";
import { HStack } from "../components/ui/hstack";
import { Input, InputField } from "../components/ui/input";
import { useState, useRef, RefObject } from "react";
import colors from "tailwindcss/colors";
import { SaveIcon } from "lucide-react-native";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "../components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategorySelector } from "../features/category-selector";
import { AccountBalanceInline } from "../features/account-balance-inline";
import { getAllAccounts, createTransaction } from "../libs/api";
import dayjs from "dayjs";
import { DateLabel } from "../components/date-label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useAppToast } from "../hooks/use-app-toast";
import { TextInput, TextInputProps } from "react-native";

export default function Transaction() {
  const { type, date } = useLocalSearchParams();

  if (type !== "income" && type !== "expense") {
    throw new Error("Invalid type parameter.");
  }

  if (typeof date !== "string") {
    throw new Error("Invalid date parameter.");
  }

  const queryClient = useQueryClient();
  const toast = useAppToast();

  const accountQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });

  const [selectedCatagoryId, setSelectedCatagoryId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const amountInputRef = useRef<TextInput>(null);

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      console.log("Transaction created successfully");

      // Show success toast
      toast.success("บันทึกรายการสำเร็จ");

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", date] });
      queryClient.invalidateQueries({ queryKey: ["summary", date] });

      const startOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
      const endOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");
      queryClient.invalidateQueries({
        queryKey: ["transactionIdsByDate", startOfMonth, endOfMonth],
      });

      router.back();
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);

      // Show error toast
      toast.error("เกิดข้อผิดพลาดในการบันทึกรายการ", "กรุณาลองใหม่อีกครั้ง");
    },
  });

  const handleSave = () => {
    createTransactionMutation.mutate({
      userId: accountQuery.data?.[0]?.userId || "",
      accountId: accountQuery.data?.[0]?._id || "",
      categoryId: selectedCatagoryId,
      type: type,
      amount: parseFloat(amount),
      currency: "THB", // Assuming THB for Thai Baht
      note: note.trim() || undefined,
      date: date,
      timezone: dayjs.tz.guess(),
    });
  };

  return (
    <>
      <KeyboardAwareScrollView className="flex-1 bg-gray-100">
        <VStack space="md" className="p-4">
          <VStack>
            <Heading size="3xl" className="text-typography-black">
              {type === "income" ? "เพิ่มรายรับ" : "เพิ่มรายจ่าย"}
            </Heading>
            <DateLabel date={date} />
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold className="text-typography-black">
              ประเภท
            </Heading>
            <CategorySelector
              type={type}
              value={selectedCatagoryId}
              onChange={(item) => {
                setSelectedCatagoryId(item._id);
                amountInputRef.current?.focus();
              }}
            />
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold className="text-typography-black">
              จำนวนเงิน
            </Heading>
            <Input size="xl" className="rounded-2xl">
              <InputField
                ref={amountInputRef as RefObject<TextInputProps>}
                type="text"
                placeholder="0"
                value={amount}
                onChangeText={(text) => setAmount(text)}
                keyboardType="numeric"
              />
            </Input>
            <HStack space="xs" className="items-baseline">
              <Text className="text-teal-500">เงินคงเหลือ</Text>
              <AccountBalanceInline />
            </HStack>
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold className="text-typography-black">
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
        className="p-4 bg-white border-t border-gray-200 rounded-t-2xl overflow-hidden"
      >
        <Button
          size="xl"
          className="rounded-2xl bg-blue-500 data-[hover=true]:bg-blue-600 data-[active=true]:bg-blue-700"
          onPress={handleSave}
          isDisabled={
            !selectedCatagoryId ||
            !amount.trim() ||
            isNaN(parseFloat(amount)) ||
            parseFloat(amount) <= 0 ||
            createTransactionMutation.isPending
          }
        >
          {createTransactionMutation.isPending ? (
            <ButtonSpinner color={colors.white} />
          ) : (
            <ButtonIcon as={SaveIcon} />
          )}
          <ButtonText>บันทึก</ButtonText>
        </Button>
      </SafeAreaView>
    </>
  );
}
