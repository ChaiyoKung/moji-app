import Svg, { Circle } from "react-native-svg";
import { Box } from "../ui/box";
import { Center } from "../ui/center";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { formatBaht } from "../../utils/format-baht";

export interface DonutChartItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  items: DonutChartItem[];
  size?: number;
}

const STROKE = 28;
const GAP = 2;

export function DonutChart({ items, size = 168 }: DonutChartProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = items.length > 1 ? GAP : 0;

  let offset = 0;
  const arcs = items.map((item) => {
    const length = (item.value / total) * circumference;
    const arc = { item, length, offset };
    offset += length;
    return arc;
  });

  return (
    <VStack space="lg">
      <Center>
        <Box style={{ width: size, height: size }}>
          <Svg width={size} height={size}>
            {arcs.map(({ item, length, offset: start }) => (
              <Circle
                key={item.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={STROKE}
                strokeDasharray={`${Math.max(length - gap, 0)} ${circumference}`}
                strokeDashoffset={-start}
                rotation={-90}
                origin={`${size / 2}, ${size / 2}`}
              />
            ))}
          </Svg>
          <Center className="absolute inset-0">
            <Text size="xs" className="text-typography-500">
              รวม
            </Text>
            <Text bold size="lg">
              {formatBaht(total)}
            </Text>
          </Center>
        </Box>
      </Center>

      <VStack space="sm">
        {items.map((item) => (
          <HStack key={item.id} space="sm" className="items-center">
            <Box
              className="size-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <Text className="flex-1 text-typography-700" isTruncated>
              {item.label}
            </Text>
            <Text bold>{formatBaht(item.value)}</Text>
            <Text size="sm" className="w-12 text-right text-typography-500">
              {Math.round((item.value / total) * 100)}%
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
