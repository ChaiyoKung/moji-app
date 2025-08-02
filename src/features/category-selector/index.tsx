import { useQuery } from "@tanstack/react-query";
import { HStack } from "../../components/ui/hstack";
import { Text } from "../../components/ui/text";
import { Spinner } from "../../components/ui/spinner";
import { CategoryChip } from "../../components/category-chip";
import { getAllGategoriesByType, Category } from "../../libs/api";

export type CategorySelectorProps = {
  type: Category["type"];
  value: Category["_id"];
  onChange: (category: Category) => void;
};

export function CategorySelector({
  type,
  value,
  onChange,
}: CategorySelectorProps) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () => getAllGategoriesByType(type),
  });

  if (categoriesQuery.isLoading) {
    return <Spinner />;
  }

  if (categoriesQuery.error) {
    return <Text className="text-red-500">เกิดข้อผิดพลาดในการโหลดประเภท</Text>;
  }

  if (!categoriesQuery.data || categoriesQuery.data.length === 0) {
    return <Text className="text-gray-500">ไม่มีประเภท</Text>;
  }

  return (
    <HStack space="sm" className="flex-wrap">
      {categoriesQuery.data.map((category: Category) => (
        <CategoryChip
          key={category._id}
          data={category}
          selected={value === category._id}
          onPress={() => onChange(category)}
        />
      ))}
    </HStack>
  );
}
