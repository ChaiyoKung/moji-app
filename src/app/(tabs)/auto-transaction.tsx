import { useRef, useState } from "react";
import { FlatList } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box } from "../../components/ui/box";
import { Image } from "../../components/ui/image";
import { Input, InputField } from "../../components/ui/input";
import { HStack } from "../../components/ui/hstack";
import { VStack } from "../../components/ui/vstack";
import {
  CameraIcon,
  ImageIcon,
  SendHorizonalIcon,
  XIcon,
} from "lucide-react-native";
import {
  ChatBubble,
  ChatBubbleSpinner,
  ChatBubbleText,
} from "../../components/chat-bubble";
import {
  getAllAccounts,
  getAllGategoriesByType,
  autoExtractTransactions,
} from "../../libs/api";
import type { Category, Transaction, FailedItem } from "../../libs/api";
import { TransactionItem } from "../../components/transaction-item";
import {
  toReactNativeFile,
  useImagePicker,
} from "../../hooks/use-image-picker";
import { Button, ButtonIcon, ButtonSpinner } from "../../components/ui/button";
import { Image as ImageType } from "react-native-image-crop-picker";
import { useSettingStore } from "../../stores/use-setting-store";

interface UserMessage {
  id: string;
  role: "user";
  text?: string;
  imageUri?: string;
  timestamp: number;
}

interface LoadingMessage {
  id: string;
  role: "loading";
  timestamp: number;
}

interface ResultMessage {
  id: string;
  role: "result";
  created: Transaction[];
  failed: FailedItem[];
  timestamp: number;
}

interface ErrorMessage {
  id: string;
  role: "error";
  message: string;
  timestamp: number;
}

type ChatMessage = UserMessage | LoadingMessage | ResultMessage | ErrorMessage;

function LoadingBubble() {
  return (
    <ChatBubble align="left" color="default">
      <HStack space="sm" className="items-center">
        <ChatBubbleSpinner size="small" />
        <ChatBubbleText>กำลังประมวลผล...</ChatBubbleText>
      </HStack>
    </ChatBubble>
  );
}

function ErrorBubble({ message }: { message: string }) {
  return (
    <ChatBubble align="left" color="error" variant="outline">
      <ChatBubbleText>{message}</ChatBubbleText>
    </ChatBubble>
  );
}

function FailureBubble({ item }: { item: FailedItem }) {
  return (
    <ChatBubble align="left" color="warn" variant="outline">
      <ChatBubbleText>
        {`รายการที่ ${item.item} ไม่สามารถประมวลผลได้ กรุณาเพิ่มบันทึกด้วยตนเอง (${item.reason})`}
      </ChatBubbleText>
    </ChatBubble>
  );
}

interface ResultMessageViewProps {
  message: ResultMessage;
  categoryMap: Record<string, Category>;
}

function ResultMessageView({ message, categoryMap }: ResultMessageViewProps) {
  if (message.created.length === 0 && message.failed.length === 0) {
    return (
      <ChatBubble align="left" color="default">
        <ChatBubbleText>ไม่พบรายการที่ประมวลผลได้</ChatBubbleText>
      </ChatBubble>
    );
  }

  return (
    <VStack space="xs" className="w-full max-w-xs">
      {message.created.map((item) => {
        const category = categoryMap[item.categoryId];
        if (!category) return null;
        return (
          <TransactionItem
            key={item._id}
            data={{ ...item, categoryId: category }}
            showDate
          />
        );
      })}
      {message.failed.map((item, index) => (
        <FailureBubble key={index} item={item} />
      ))}
    </VStack>
  );
}

interface UserBubbleProps {
  text?: string;
  imageUri?: string;
}

function UserBubble({ text, imageUri }: UserBubbleProps) {
  return (
    <VStack space="xs" className="max-w-xs self-end">
      {imageUri ? (
        <Image
          size="none"
          source={{ uri: imageUri }}
          alt="user uploaded image"
          className="h-40 w-40 self-end rounded-2xl"
          resizeMode="cover"
        />
      ) : null}
      {text ? (
        <ChatBubble align="right" color="primary">
          <ChatBubbleText>{text}</ChatBubbleText>
        </ChatBubble>
      ) : null}
    </VStack>
  );
}

export default function AutoTransactionScreen() {
  const queryClient = useQueryClient();
  const isAutoTransactionConfirm = useSettingStore(
    (state) => state.isAutoTransactionConfirm
  );
  const imagePicker = useImagePicker({
    cropping: true,
    freeStyleCropEnabled: true,
    mediaType: "photo",
    compressImageQuality: 0.8,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<ImageType>();
  const loadingId = useRef<string>("");

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });

  const incomeCategoriesQuery = useQuery({
    queryKey: ["categories", "income"],
    queryFn: () => getAllGategoriesByType("income"),
  });

  const expenseCategoriesQuery = useQuery({
    queryKey: ["categories", "expense"],
    queryFn: () => getAllGategoriesByType("expense"),
  });

  const categories: Category[] = [
    ...(incomeCategoriesQuery.data ?? []),
    ...(expenseCategoriesQuery.data ?? []),
  ];

  const categoryMap = Object.fromEntries(categories.map((c) => [c._id, c]));

  const autoExtractMutation = useMutation({
    mutationFn: autoExtractTransactions,
    onMutate: () => {
      setText("");
      setImage(undefined);
    },
    onSuccess: (result) => {
      const resultMsg: ChatMessage = {
        id: `${Date.now()}-result`,
        role: "result",
        created: result.created,
        failed: result.failed,
        timestamp: Date.now(),
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId.current ? resultMsg : m))
      );
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactionIdsByDate"] });
    },
    onError: () => {
      const errorMsg: ChatMessage = {
        id: `${Date.now()}-error`,
        role: "error",
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง",
        timestamp: Date.now(),
      };
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId.current ? errorMsg : m))
      );
    },
  });

  const sendEnabled =
    !autoExtractMutation.isPending &&
    (text.trim().length > 0 || image !== undefined) &&
    accountsQuery.data !== undefined &&
    accountsQuery.data.length > 0;

  const handleSend = () => {
    if (!sendEnabled) return;

    const account = accountsQuery.data[0];

    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: text || undefined,
      imageUri: image?.path || undefined,
      timestamp: Date.now(),
    };

    loadingId.current = `${Date.now()}-loading`;
    const loadingMsg: ChatMessage = {
      id: loadingId.current,
      role: "loading",
      timestamp: Date.now(),
    };

    setMessages((prev) => [loadingMsg, userMsg, ...prev]);

    autoExtractMutation.mutate({
      accountId: account._id,
      currency: account.currency,
      status: isAutoTransactionConfirm ? "confirmed" : "draft",
      text: text || undefined,
      image: image ? toReactNativeFile(image) : undefined,
    });
  };

  const handleOpenLibrary = async () => {
    const image = await imagePicker.openLibrary();
    if (image) setImage(image);
  };

  const handleOpenCamera = async () => {
    const image = await imagePicker.openCamera();
    if (image) setImage(image);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    if (item.role === "user") {
      return <UserBubble text={item.text} imageUri={item.imageUri} />;
    }
    if (item.role === "loading") {
      return <LoadingBubble />;
    }
    if (item.role === "result") {
      return <ResultMessageView message={item} categoryMap={categoryMap} />;
    }
    if (item.role === "error") {
      return <ErrorBubble message={item.message} />;
    }
    return null;
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background-100">
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
          ItemSeparatorComponent={() => <Box className="h-4" />}
          contentContainerClassName="p-4"
        />

        <Box className="border-t border-outline-200 bg-background-0">
          {image ? (
            <Box className="px-4 pt-3">
              <Box className="relative self-start">
                <Image
                  size="none"
                  source={{ uri: image.path }}
                  alt="attached image preview"
                  className="h-20 w-20 rounded-xl"
                  resizeMode="cover"
                />
                <Button
                  onPress={() => setImage(undefined)}
                  size="xs"
                  className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full p-0"
                  action="dark"
                >
                  <ButtonIcon as={XIcon} size="xs" />
                </Button>
              </Box>
            </Box>
          ) : null}

          <HStack space="sm" className="items-end px-4 py-3">
            <Button
              action="secondary"
              variant="outline"
              onPress={handleOpenCamera}
              className="aspect-square rounded-full"
            >
              <ButtonIcon as={CameraIcon} />
            </Button>
            <Button
              action="secondary"
              variant="outline"
              onPress={handleOpenLibrary}
              className="aspect-square rounded-full"
            >
              <ButtonIcon as={ImageIcon} />
            </Button>

            <Input variant="outline" className="flex-1 rounded-2xl">
              <InputField
                type="text"
                value={text}
                onChangeText={setText}
                placeholder="ผัดไทย 45 ไก่ทอด 30 ..."
              />
            </Input>

            <Button
              onPress={handleSend}
              isDisabled={!sendEnabled}
              className="aspect-square rounded-full"
            >
              {autoExtractMutation.isPending ? (
                <ButtonSpinner />
              ) : (
                <ButtonIcon as={SendHorizonalIcon} />
              )}
            </Button>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
