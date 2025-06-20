import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Heading } from "../components/ui/heading";
import { VStack } from "../components/ui/vstack";
import { Text } from "../components/ui/text";
import { HStack } from "../components/ui/hstack";
import { Pressable } from "../components/ui/pressable";
import { Input, InputField } from "../components/ui/input";
import { useState } from "react";
import { formatBaht } from "../utils/format-baht";
import colors from "tailwindcss/colors";
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
import {
  getAllGategoriesByType,
  getAllAccounts,
  createTransaction,
} from "../libs/api";
import dayjs from "dayjs";

export default function Transaction() {
  const { mode, date } = useLocalSearchParams();

  if (mode !== "income" && mode !== "expense") {
    throw new Error("Invalid mode parameter.");
  }

  if (typeof date !== "string") {
    throw new Error("Invalid date parameter.");
  }

  const queryClient = useQueryClient();

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

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: (data) => {
      console.log("Transaction created successfully:", data);
      // Optionally, you can navigate back or show a success message
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", date] });
      router.back();
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
      // Optionally, you can show an error message to the user
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
      date: new Date(date),
    });
  };

  const relativeDate = dayjs(date).format("D MMMM YYYY");

  return (
    <>
      <ScrollView className="flex-1 bg-gray-100">
        <VStack space="md" className="p-4">
          <VStack>
            <Heading size="3xl" className="text-typography-black">
              {mode === "income" ? "เพิ่มรายรับ" : "เพิ่มรายจ่าย"}
            </Heading>
            {dayjs(date).isToday() ? (
              <Text className="text-gray-500">{`ของวันนี้ (${relativeDate})`}</Text>
            ) : dayjs(date).isYesterday() ? (
              <Text className="text-orange-500">{`⚠️ ของเมื่อวาน (${relativeDate})`}</Text>
            ) : (
              <Text className="text-orange-500">{`⚠️ ของ ${relativeDate}`}</Text>
            )}
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
                  <Pressable
                    key={category._id}
                    className="flex-row items-center border rounded-full px-4 py-1"
                    style={{
                      borderColor: category.color,
                      backgroundColor:
                        selectedCatagoryId === category._id
                          ? category.color
                          : "transparent",
                    }}
                    onPress={() => setSelectedCatagoryId(category._id)}
                  >
                    <Text size="lg">{category.icon}</Text>
                    <Text
                      size="lg"
                      className="ml-2"
                      style={{
                        color:
                          selectedCatagoryId === category._id
                            ? colors.white
                            : category.color,
                      }}
                    >
                      {category.name}
                    </Text>
                  </Pressable>
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
              {accountQuery.isLoading ? (
                <Spinner />
              ) : accountQuery.error ? (
                <Text className="text-red-500">
                  เกิดข้อผิดพลาดในการโหลดยอดเงิน
                </Text>
              ) : accountQuery.data?.[0]?.balance === undefined ? (
                <Text className="text-gray-500">ไม่มีบัญชี</Text>
              ) : (
                <Text className="text-teal-500">
                  {formatBaht(accountQuery.data[0].balance)}
                </Text>
              )}
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
      </ScrollView>

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
