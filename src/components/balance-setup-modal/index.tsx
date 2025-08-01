import { useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../ui/modal";
import { Heading } from "../ui/heading";
import { Icon } from "../ui/icon";
import { X, SaveIcon } from "lucide-react-native";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";

export interface BalanceSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSaving: boolean;
  onSave: (balance: string) => void;
}

export function BalanceSetupModal({
  isOpen,
  onClose,
  isSaving,
  onSave,
}: BalanceSetupModalProps) {
  const [balance, setBalance] = useState<string>("");

  const handleSave = () => {
    onSave(balance);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="rounded-2xl">
        <ModalHeader>
          <Heading size="md" className="text-typography-black">
            กรอกยอดเงินคงเหลือ
          </Heading>
          <ModalCloseButton>
            <Icon
              as={X}
              size="md"
              className="text-gray-500 group-[:hover]/modal-close-button:text-gray-600 group-[:active]/modal-close-button:text-gray-700 group-[:focus-visible]/modal-close-button:text-gray-700"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text size="sm" className="text-gray-500 mb-2">
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
            isDisabled={!balance || isSaving}
            onPress={handleSave}
            className="rounded-2xl"
          >
            {isSaving ? <ButtonSpinner /> : <ButtonIcon as={SaveIcon} />}
            <ButtonText>บันทึก</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
