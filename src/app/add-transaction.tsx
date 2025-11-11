import { router, useLocalSearchParams } from "expo-router";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { Text } from "../components/ui/text";
import { HStack } from "../components/ui/hstack";
import { Input, InputField } from "../components/ui/input";
import { useState, useRef, RefObject } from "react";
import { MinusIcon, PlusIcon, SaveIcon } from "lucide-react-native";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "../components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategorySelector } from "../features/category-selector";
import { AccountBalanceInline } from "../features/account-balance-inline";
import {
  getAllAccounts,
  createTransactionMany,
  CreateTransactionDto,
} from "../libs/api";
import dayjs from "dayjs";
import { DateLabel } from "../components/date-label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useAppToast } from "../hooks/use-app-toast";
import { TextInput, TextInputProps } from "react-native";
import { arrayFill } from "../utils/array";
import { env } from "../env";

const minQuantity: number = 1;
const maxQuantity: number = env.EXPO_PUBLIC_TRANSACTION_INSERT_MAX_BATCH_SIZE;

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
  const [quantity, setQuantity] = useState<number>(minQuantity);

  const amountInputRef = useRef<TextInput>(null);

  const createTransactionManyMutation = useMutation({
    mutationFn: createTransactionMany,
    onSuccess: () => {
      console.log("Transaction created successfully");
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
      toast.error("เกิดข้อผิดพลาดในการบันทึกรายการ", "กรุณาลองใหม่อีกครั้ง");
    },
  });

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(maxQuantity, prev + 1));
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(minQuantity, prev - 1));
  };

  const handleSave = () => {
    const transaction: CreateTransactionDto = {
      userId: accountQuery.data?.[0]?.userId || "",
      accountId: accountQuery.data?.[0]?._id || "",
      categoryId: selectedCatagoryId,
      type: type,
      amount: parseInt(amount),
      currency: "THB", // Assuming THB for Thai Baht
      note: note.trim() || undefined,
      date: date,
      timezone: dayjs.tz.guess(),
    };
    const transactions = arrayFill(quantity, transaction);
    createTransactionManyMutation.mutate(transactions);
  };

  const isButtonDisabled =
    !selectedCatagoryId ||
    !amount.trim() ||
    isNaN(parseInt(amount)) ||
    parseInt(amount) <= 0 ||
    createTransactionManyMutation.isPending;

  return (
    <>
      <KeyboardAwareScrollView className="flex-1 bg-background-100">
        <VStack space="md" className="p-4">
          <VStack>
            <Heading size="3xl">
              {type === "income" ? "เพิ่มรายรับ" : "เพิ่มรายจ่าย"}
            </Heading>
            <DateLabel date={date} />
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold>
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
            <Heading size="md" bold>
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
        <ButtonGroup flexDirection="row" className="gap-[1px]">
          <Button
            size="xl"
            className="aspect-square rounded-r-none p-0"
            onPress={handleDecreaseQuantity}
            isDisabled={isButtonDisabled || quantity <= minQuantity}
          >
            <ButtonIcon as={MinusIcon} />
          </Button>
          <Button
            size="xl"
            className="flex-1 rounded-none"
            onPress={handleSave}
            isDisabled={isButtonDisabled}
          >
            {createTransactionManyMutation.isPending ? (
              <ButtonSpinner />
            ) : (
              <ButtonIcon as={SaveIcon} />
            )}
            <ButtonText>บันทึก {quantity} รายการ</ButtonText>
          </Button>
          <Button
            size="xl"
            className="aspect-square rounded-l-none p-0"
            onPress={handleIncreaseQuantity}
            isDisabled={isButtonDisabled || quantity >= maxQuantity}
          >
            <ButtonIcon as={PlusIcon} />
          </Button>
        </ButtonGroup>
      </SafeAreaView>
    </>
  );
}
