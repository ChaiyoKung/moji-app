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
      className="flex-row items-center gap-2 border rounded-full px-4 py-1"
      style={{
        borderColor: data.color,
        backgroundColor: selected ? data.color : "transparent",
      }}
      onPress={onPress}
    >
      {data.icon !== undefined && <Text size="xl">{data.icon}</Text>}
      <Text
        size="xl"
        style={{
          color: selected ? colors.white : data.color,
        }}
      >
        {data.name}
      </Text>
    </Pressable>
  );
}
