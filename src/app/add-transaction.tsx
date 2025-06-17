import { useLocalSearchParams } from "expo-router";
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
import { Button, ButtonIcon, ButtonText } from "../components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { SaveIcon } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "../libs/axios";
import { Spinner } from "../components/ui/spinner";

interface Category {
  _id: string;
  userId: string | null;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Transaction() {
  const { mode, date } = useLocalSearchParams();

  if (mode !== "income" && mode !== "expense") {
    throw new Error("Invalid mode parameter.");
  }

  if (typeof date !== "string") {
    throw new Error("Invalid date parameter.");
  }

  const categoriesQuery = useQuery({
    queryKey: ["categories", mode],
    queryFn: async () => {
      const response = await api.get<Category[]>(`/categories/${mode}`);
      return response.data;
    },
  });

  const [selectedCatagoryId, setSelectedCatagoryId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const handleSave = () => {
    console.log("Transaction saved:", {
      mode,
      date,
      category: selectedCatagoryId,
      amount: parseFloat(amount),
      note,
    });
  };
  return (
    <>
      <ScrollView className="flex-1 bg-gray-100">
        <VStack space="md" className="p-4">
          <VStack>
            <Heading size="3xl" className="text-typography-black">
              {mode === "income" ? "เพิ่มรายรับ" : "เพิ่มรายจ่าย"}
            </Heading>
            <Text>{`ของวันนี้ (${date})`}</Text>
          </VStack>

          <VStack space="sm">
            <Heading bold className="text-typography-black">
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
                    <Text className="text-lg">{category.icon}</Text>
                    <Text
                      className="ml-2 text-lg"
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
            <Heading bold className="text-typography-black">
              จำนวนเงิน
            </Heading>
            <Input className="rounded-2xl bg-gray-200">
              <InputField
                type="text"
                placeholder="0"
                value={amount}
                onChangeText={(text) => setAmount(text)}
                keyboardType="numeric"
              />
            </Input>
            <Text className="text-teal-500">
              {`เงินคงเหลือ ${formatBaht(19934)}`}
            </Text>
          </VStack>

          <VStack space="sm">
            <Heading bold className="text-typography-black">
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
        >
          <ButtonIcon as={SaveIcon} />
          <ButtonText>บันทึก</ButtonText>
        </Button>
      </SafeAreaView>
    </>
  );
}
