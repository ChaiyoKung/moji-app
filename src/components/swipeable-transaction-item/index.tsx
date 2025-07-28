import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Pressable } from "../ui/pressable";
import { Icon } from "../ui/icon";
import { Trash2 } from "lucide-react-native";
import colors from "tailwindcss/colors";
import { TransactionItem } from "../transaction-item";
import { deleteTransaction, TransactionWithCategory } from "../../libs/api";
import { useAppToast } from "../../hooks/use-app-toast";

export interface SwipeableTransactionItemProps {
  data: TransactionWithCategory;
}

export function SwipeableTransactionItem({
  data,
}: SwipeableTransactionItemProps) {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactionIdsByDate"] });
      toast.success("ลบรายการเรียบร้อยแล้ว");
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error);
      toast.error("ไม่สามารถลบรายการได้", "กรุณาลองใหม่อีกครั้ง");
    },
  });

  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable
          onPress={() => deleteTransactionMutation.mutate(data._id)}
          className="bg-red-500 justify-center items-center rounded-2xl aspect-square"
          disabled={deleteTransactionMutation.isPending}
        >
          <Icon as={Trash2} size="xl" className="text-white" />
        </Pressable>
      )}
      containerStyle={{
        backgroundColor: colors.red[500],
        borderRadius: 16,
        overflow: "visible",
        marginHorizontal: 16,
      }}
    >
      <TransactionItem data={data} />
    </Swipeable>
  );
}
