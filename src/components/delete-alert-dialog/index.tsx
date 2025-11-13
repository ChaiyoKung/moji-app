import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

export interface DeleteAlertDialogProps {
  title: string;
  description: string;
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
}

export function DeleteAlertDialog({
  title,
  description,
  isOpen,
  onClose,
  onDelete,
}: DeleteAlertDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} size="md">
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading>{title}</Heading>
        </AlertDialogHeader>
        <AlertDialogBody className="mb-4 mt-3">
          <Text size="sm">{description}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            size="sm"
            onPress={onClose}
          >
            <ButtonText>ยกเลิก</ButtonText>
          </Button>
          <Button action="negative" size="sm" onPress={onDelete}>
            <ButtonText>ลบ</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
