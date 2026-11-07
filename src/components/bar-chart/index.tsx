import { useState } from "react";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { formatBaht, formatBahtCompact } from "../../utils/format-baht";

export interface BarChartDatum {
  label: string;
  values: number[];
}

export interface BarChartProps {
  data: BarChartDatum[];
  colors: string[];
  seriesNames: string[];
  height?: number;
  /** Show an x label only for every n-th group. */
  labelEvery?: number;
}

function niceMax(max: number) {
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  const n = max / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

export function BarChart({
  data,
  colors,
  seriesNames,
  height = 160,
  labelEvery = 1,
}: BarChartProps) {
  const [selected, setSelected] = useState(data.length - 1);
  const top = niceMax(Math.max(0, ...data.flatMap((d) => d.values)));
  const picked = data[Math.min(selected, data.length - 1)];

  return (
    <VStack space="sm">
      <HStack space="md" className="min-h-6 flex-wrap items-center">
        <Text size="sm" bold className="text-typography-700">
          {picked.label}
        </Text>
        {picked.values.map((value, i) => (
          <HStack key={seriesNames[i]} space="xs" className="items-center">
            <Box
              className="size-2.5 rounded-full"
              style={{ backgroundColor: colors[i] }}
            />
            <Text size="sm" className="text-typography-700">
              {seriesNames[i]} {formatBaht(value)}
            </Text>
          </HStack>
        ))}
      </HStack>

      <Box style={{ height }}>
        {[1, 0.5].map((ratio) => (
          <Box
            key={ratio}
            className="absolute inset-x-0 border-t border-outline-200"
            style={{ top: (1 - ratio) * height }}
          >
            <Text size="2xs" className="text-typography-500">
              {formatBahtCompact(top * ratio)}
            </Text>
          </Box>
        ))}
        <Box className="absolute inset-x-0 bottom-0 border-t border-outline-300" />
        <HStack className="absolute inset-0 items-end">
          {data.map((d, index) => (
            <Pressable
              key={d.label}
              accessibilityLabel={`${d.label} ${d.values
                .map((v, i) => `${seriesNames[i]} ${formatBaht(v)}`)
                .join(" ")}`}
              onPress={() => setSelected(index)}
              className="h-full flex-1 flex-row items-end justify-center px-0.5"
              style={{ gap: 2 }}
            >
              {d.values.map((value, i) => (
                <Box
                  key={seriesNames[i]}
                  className="max-w-6 flex-1 rounded-t-[4px]"
                  style={{
                    height: `${(value / top) * 100}%`,
                    backgroundColor: colors[i],
                    opacity: index === selected ? 1 : 0.6,
                  }}
                />
              ))}
            </Pressable>
          ))}
        </HStack>
      </Box>

      <HStack>
        {data.map((d, index) => (
          <Box key={d.label} className="flex-1 items-center">
            {index % labelEvery === 0 && (
              <Text size="2xs" className="text-typography-500">
                {d.label}
              </Text>
            )}
          </Box>
        ))}
      </HStack>
    </VStack>
  );
}
