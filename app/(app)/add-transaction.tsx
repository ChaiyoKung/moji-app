import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { Heading } from "../../components/ui/heading";
import { VStack } from "../../components/ui/vstack";
import { Text } from "../../components/ui/text";
import { HStack } from "../../components/ui/hstack";
import { Pressable } from "../../components/ui/pressable";
import { Input, InputField } from "../../components/ui/input";
import { useState } from "react";
import { formatBaht } from "../../utils/format-baht";
import colors from "tailwindcss/colors";
import { Button, ButtonIcon, ButtonText } from "../../components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { SaveIcon } from "lucide-react-native";

const categories = [
  {
    _id: "cat_income_01",
    userId: null,
    name: "ได้เงิน",
    type: "income",
    icon: "💰",
    color: "#4CAF50",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_breakfast_01",
    userId: null,
    name: "ข้าวเช้า",
    type: "expense",
    icon: "🍳",
    color: "#FFA726",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_lunch_01",
    userId: null,
    name: "ข้าวเที่ยง",
    type: "expense",
    icon: "🍛",
    color: "#FFB74D",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_dinner_01",
    userId: null,
    name: "ข้าวเย็น",
    type: "expense",
    icon: "🍲",
    color: "#FF7043",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_drinks_01",
    userId: null,
    name: "เครื่องดื่ม",
    type: "expense",
    icon: "🥤",
    color: "#00BCD4",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_snacks_01",
    userId: null,
    name: "ขนม",
    type: "expense",
    icon: "🍩",
    color: "#F06292",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_utilities_01",
    userId: null,
    name: "ของใช้",
    type: "expense",
    icon: "🧻",
    color: "#9E9E9E",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_toys_01",
    userId: null,
    name: "ของเล่น",
    type: "expense",
    icon: "🧸",
    color: "#BA68C8",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_laundry_01",
    userId: null,
    name: "ซักผ้า",
    type: "expense",
    icon: "🧺",
    color: "#4FC3F7",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_fuel_01",
    userId: null,
    name: "เติมน้ำมัน",
    type: "expense",
    icon: "⛽",
    color: "#F44336",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "cat_other_01",
    userId: null,
    name: "อื่นๆ",
    type: "expense",
    icon: "🗂️",
    color: "#90A4AE",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function Transaction() {
  const { mode, date } = useLocalSearchParams();

  if (mode !== "income" && mode !== "expense") {
    throw new Error("Invalid mode parameter.");
  }

  if (typeof date !== "string") {
    throw new Error("Invalid date parameter.");
  }

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
            <HStack space="sm" className="flex-wrap">
              {categories.map((category) => (
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
