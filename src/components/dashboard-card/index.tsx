import { ReactNode } from "react";
import { Box } from "../ui/box";
import { Heading } from "../ui/heading";
import { VStack } from "../ui/vstack";

export interface DashboardCardProps {
  title: string;
  children: ReactNode;
}

export function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <Box className="rounded-2xl border border-outline-200 bg-background-0 p-4">
      <VStack space="md">
        <Heading size="md" bold>
          {title}
        </Heading>
        {children}
      </VStack>
    </Box>
  );
}
