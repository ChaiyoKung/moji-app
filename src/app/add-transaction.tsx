import { router, useLocalSearchParams } from "expo-router";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { Text } from "../components/ui/text";
import { HStack } from "../components/ui/hstack";
import { Input, InputField } from "../components/ui/input";
import { useState } from "react";
import { formatBaht } from "../utils/format-baht";
import colors from "tailwindcss/colors";
import { Pressable } from "../components/ui/pressable";
import { Icon } from "../components/ui/icon";
import { Eye, EyeOff } from "lucide-react-native";
import { useAsyncStorageState } from "../hooks/use-async-storage-state";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "../components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { SaveIcon } from "lucide-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "../components/ui/spinner";
import { CategoryChip } from "../components/category-chip";
import {
  getAllGategoriesByType,
  getAllAccounts,
  createTransaction,
} from "../libs/api";
import dayjs from "dayjs";
import { DateLabel } from "../components/date-label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useAppToast } from "../hooks/use-app-toast";

export default function Transaction() {
  const { mode, date } = useLocalSearchParams();

  if (mode !== "income" && mode !== "expense") {
    throw new Error("Invalid mode parameter.");
  }

  if (typeof date !== "string") {
    throw new Error("Invalid date parameter.");
  }

  const queryClient = useQueryClient();
  const toast = useAppToast();

  const categoriesQuery = useQuery({
    queryKey: ["categories", mode],
    queryFn: () => getAllGategoriesByType(mode),
  });

  const accountQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });

  const [selectedCatagoryId, setSelectedCatagoryId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [[loadingHide, hideBalance], setHideBalance] =
    useAsyncStorageState("hideBalance");
  const isBalanceHidden = hideBalance === "true";

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
      type: mode,
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
              {mode === "income" ? "เพิ่มรายรับ" : "เพิ่มรายจ่าย"}
            </Heading>
            <DateLabel date={date} />
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold className="text-typography-black">
              ประเภท
            </Heading>
            {categoriesQuery.isLoading ? (
              <Spinner />
            ) : categoriesQuery.error ? (
              <Text className="text-red-500">
                เกิดข้อผิดพลาดในการโหลดประเภท
              </Text>
            ) : categoriesQuery.data === undefined ||
              categoriesQuery.data.length === 0 ? (
              <Text className="text-gray-500">ไม่มีประเภท</Text>
            ) : (
              <HStack space="sm" className="flex-wrap">
                {categoriesQuery.data.map((category) => (
                  <CategoryChip
                    key={category._id}
                    data={category}
                    selected={selectedCatagoryId === category._id}
                    onPress={() => setSelectedCatagoryId(category._id)}
                  />
                ))}
              </HStack>
            )}
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold className="text-typography-black">
              จำนวนเงิน
            </Heading>
            <Input className="rounded-2xl">
              <InputField
                type="text"
                placeholder="0"
                value={amount}
                onChangeText={(text) => setAmount(text)}
                keyboardType="numeric"
              />
            </Input>
            <HStack space="xs" className="items-baseline">
              <Text className="text-teal-500">เงินคงเหลือ</Text>
              <Pressable
                className="flex-row items-center gap-1"
                onPress={() =>
                  setHideBalance(isBalanceHidden ? "false" : "true")
                }
              >
                {accountQuery.isLoading || loadingHide ? (
                  <Spinner />
                ) : accountQuery.error ? (
                  <Text className="text-red-500">
                    เกิดข้อผิดพลาดในการโหลดยอดเงิน
                  </Text>
                ) : accountQuery.data?.[0]?.balance === undefined ? (
                  <Text className="text-gray-500">ไม่มีบัญชี</Text>
                ) : (
                  <Text className="text-teal-500">
                    {isBalanceHidden
                      ? "******"
                      : formatBaht(accountQuery.data[0].balance)}
                  </Text>
                )}
                {isBalanceHidden ? (
                  <Icon as={EyeOff} size="sm" className="text-typography-300" />
                ) : (
                  <Icon as={Eye} size="sm" className="text-typography-300" />
                )}
              </Pressable>
            </HStack>
          </VStack>

          <VStack space="sm">
            <Heading size="md" bold className="text-typography-black">
              บันทึกช่วยจำ
            </Heading>
            <Input className="rounded-2xl">
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
