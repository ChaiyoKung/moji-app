import { useLocalSearchParams } from "expo-router";
import { Heading } from "../../../components/ui/heading";
import { VStack } from "../../../components/ui/vstack";
import { Text } from "../../../components/ui/text";
import { HStack } from "../../../components/ui/hstack";
import { Input, InputField } from "../../../components/ui/input";
import { useState, useEffect } from "react";
import { SaveIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "../../../components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { CategorySelector } from "../../../features/category-selector";
import { AccountBalanceInline } from "../../../features/account-balance-inline";
import { DateLabel } from "../../../components/date-label";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Center } from "../../../components/ui/center";
import { Spinner } from "../../../components/ui/spinner";
import { getTransactionById } from "../../../libs/api";

export default function EditTransaction() {
  const { id } = useLocalSearchParams();
  if (typeof id !== "string") throw new Error("Invalid id parameter.");

  const [selectedCatagoryId, setSelectedCatagoryId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const transactionQuery = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionById(id),
  });

  useEffect(() => {
    if (transactionQuery.data) {
      setSelectedCatagoryId(transactionQuery.data.categoryId._id);
      setAmount(transactionQuery.data.amount.toString());
      setNote(transactionQuery.data.note || "");
    }
  }, [transactionQuery.data]);

  const handleSave = () => {
    const newData = {
      categoryId: selectedCatagoryId,
      amount: parseInt(amount),
      note: note.trim() || undefined,
    };
    console.log("Saved data:", newData);
  };

  const isButtonDisabled =
    !selectedCatagoryId ||
    !amount.trim() ||
    isNaN(parseInt(amount)) ||
    parseInt(amount) <= 0;

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
    <>
      <KeyboardAwareScrollView className="flex-1 bg-background-100">
        <VStack space="md" className="p-4">
          <VStack>
            <Heading size="3xl">
              {data.type === "income" ? "แก้ไขรายรับ" : "แก้ไขรายจ่าย"}
            </Heading>
            <Text className="text-typography-black">ID: {id}</Text>
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
        <Button size="xl" onPress={handleSave} isDisabled={isButtonDisabled}>
          <ButtonIcon as={SaveIcon} />
          <ButtonText>บันทึก</ButtonText>
        </Button>
      </SafeAreaView>
    </>
  );
}
