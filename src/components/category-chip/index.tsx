import { PressableProps } from "react-native";
import { Category } from "../../libs/api";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import colors from "tailwindcss/colors";

export interface CategoryChipProps {
  data: Category;
  selected: boolean;
  onPress?: PressableProps["onPress"];
}

export function CategoryChip({ data, selected, onPress }: CategoryChipProps) {
  return (
    <Pressable
      className="flex-row items-center border rounded-full px-4 py-1"
      style={{
        borderColor: data.color,
        backgroundColor: selected ? data.color : "transparent",
      }}
      onPress={onPress}
    >
      <Text size="lg">{data.icon}</Text>
      <Text
        size="lg"
        className="ml-2"
        style={{
          color: selected ? colors.white : data.color,
        }}
      >
        {data.name}
      </Text>
    </Pressable>
  );
}
