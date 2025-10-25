import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../components/ui/modal";
import { Heading } from "../../components/ui/heading";
import { Icon } from "../../components/ui/icon";
import { X, SaveIcon } from "lucide-react-native";
import { Text } from "../../components/ui/text";
import { Input, InputField } from "../../components/ui/input";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "../../components/ui/button";
import { useSession } from "../../components/session-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "../../libs/api";
import { useAppToast } from "../../hooks/use-app-toast";

export interface AccountBalanceSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountBalanceSetupModal({
  isOpen,
  onClose,
}: AccountBalanceSetupModalProps) {
  const { userId } = useSession();
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const [balance, setBalance] = useState<string>("");

  const createAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
    onError: (error) => {
      console.error("Failed to create account:", error);
      toast.error("ไม่สามารถสร้างบัญชีได้", "กรุณาลองใหม่อีกครั้ง");
    },
  });

  const handleSaveBalance = () => {
    if (!userId) {
      console.error("User ID is not available. Cannot create account.");
      toast.error("ไม่พบข้อมูลผู้ใช้", "กรุณาลองใหม่อีกครั้ง");
      return;
    }

    createAccountMutation.mutate({
      userId: userId,
      name: "กระเป๋าสตางค์",
      type: "cash",
      balance: parseInt(balance),
      currency: "THB",
      icon: "💵",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="rounded-2xl">
        <ModalHeader>
          <Heading size="md">กรอกยอดเงินคงเหลือ</Heading>
          <ModalCloseButton>
            <Icon
              as={X}
              size="md"
              className="text-typography-500 group-[:active]/modal-close-button:text-typography-700 group-[:focus-visible]/modal-close-button:text-typography-700 group-[:hover]/modal-close-button:text-typography-600"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text size="sm" className="mb-2 text-typography-500">
            กรุณากรอกยอดเงินคงเหลือปัจจุบันของคุณ เพื่อเริ่มต้นใช้งานแอป
          </Text>
          <Input className="rounded-2xl">
            <InputField
              type="text"
              value={balance}
              onChangeText={setBalance}
              placeholder="0"
              keyboardType="numeric"
              autoFocus
            />
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!balance || createAccountMutation.isPending}
            onPress={handleSaveBalance}
          >
            {createAccountMutation.isPending ? (
              <ButtonSpinner />
            ) : (
              <ButtonIcon as={SaveIcon} />
            )}
            <ButtonText>บันทึก</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
