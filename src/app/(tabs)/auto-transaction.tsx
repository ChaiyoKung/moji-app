import { useState } from "react";
import { FlatList } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box } from "../../components/ui/box";
import { Image } from "../../components/ui/image";
import { Input, InputField } from "../../components/ui/input";
import { HStack } from "../../components/ui/hstack";
import { VStack } from "../../components/ui/vstack";
import { PaperclipIcon, SendHorizonalIcon, XIcon } from "lucide-react-native";
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
import { useImagePicker } from "../../hooks/use-image-picker";
import { Button, ButtonIcon, ButtonSpinner } from "../../components/ui/button";

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
    <ChatBubble align="left" color="default" className="mb-4">
      <HStack space="sm" className="items-center">
        <ChatBubbleSpinner size="small" />
        <ChatBubbleText>กำลังประมวลผล...</ChatBubbleText>
      </HStack>
    </ChatBubble>
  );
}

function ErrorBubble({ message }: { message: string }) {
  return (
    <ChatBubble align="left" color="error" variant="outline" className="mb-4">
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
      <ChatBubble align="left" color="default" className="mb-4">
        <ChatBubbleText>ไม่พบรายการที่ประมวลผลได้</ChatBubbleText>
      </ChatBubble>
    );
  }

  return (
    <VStack space="xs" className="mb-4 w-full max-w-xs">
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
    <VStack space="xs" className="mb-4 max-w-xs self-end">
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [imageMime, setImageMime] = useState<string | undefined>(undefined);
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

  const categoryMap: Record<string, Category> = Object.fromEntries(
    categories.map((c) => [c._id, c])
  );

  const autoExtractMutation = useMutation({
    mutationFn: autoExtractTransactions,
  });

  const sendEnabled =
    !autoExtractMutation.isPending &&
    (text.trim().length > 0 || imageUri !== undefined) &&
    accountsQuery.data !== undefined &&
    accountsQuery.data.length > 0;

  const handleSend = () => {
    if (!sendEnabled) return;

    const account = accountsQuery.data[0];

    const msgId = Date.now().toString();
    const loadingId = `${msgId}-loading`;

    const userMsg: ChatMessage = {
      id: msgId,
      role: "user",
      text: text || undefined,
      imageUri,
      timestamp: Date.now(),
    };

    const loadingMsg: ChatMessage = {
      id: loadingId,
      role: "loading",
      timestamp: Date.now(),
    };

    setMessages((prev) => [loadingMsg, userMsg, ...prev]);
    const capturedText = text;
    const capturedImageUri = imageUri;
    const capturedImageMime = imageMime;
    setText("");
    setImageUri(undefined);
    setImageMime(undefined);

    autoExtractMutation.mutate(
      {
        accountId: account._id,
        currency: account.currency,
        text: capturedText || undefined,
        imageUri: capturedImageUri,
        imageMime: capturedImageMime,
      },
      {
        onSuccess: (result) => {
          const resultMsg: ChatMessage = {
            id: `${msgId}-result`,
            role: "result",
            created: result.created,
            failed: result.failed,
            timestamp: Date.now(),
          };
          setMessages((prev) =>
            prev.map((m) => (m.id === loadingId ? resultMsg : m))
          );
          queryClient.invalidateQueries({ queryKey: ["accounts"] });
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          queryClient.invalidateQueries({ queryKey: ["summary"] });
          queryClient.invalidateQueries({ queryKey: ["transactionIdsByDate"] });
        },
        onError: (error) => {
          const errorMsg: ChatMessage = {
            id: `${msgId}-error`,
            role: "error",
            message:
              error instanceof Error
                ? error.message
                : "เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง",
            timestamp: Date.now(),
          };
          setMessages((prev) =>
            prev.map((m) => (m.id === loadingId ? errorMsg : m))
          );
        },
      }
    );
  };

  const handleAttach = useImagePicker((picked) => {
    setImageUri(picked.uri);
    setImageMime(picked.mime);
  });

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
          className="px-4"
        />

        <Box className="border-t border-outline-200 bg-background-0">
          {imageUri ? (
            <Box className="px-4 pt-3">
              <Box className="relative self-start">
                <Image
                  size="none"
                  source={{ uri: imageUri }}
                  alt="attached image preview"
                  className="h-20 w-20 rounded-xl"
                  resizeMode="cover"
                />
                <Button
                  onPress={() => setImageUri(undefined)}
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
              onPress={handleAttach}
              className="aspect-square rounded-full"
            >
              <ButtonIcon as={PaperclipIcon} />
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
