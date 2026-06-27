import { useState } from "react";
import { FlatList } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Box } from "../../components/ui/box";
import { Image } from "../../components/ui/image";
import { Input, InputField } from "../../components/ui/input";
import { Pressable } from "../../components/ui/pressable";
import { HStack } from "../../components/ui/hstack";
import { VStack } from "../../components/ui/vstack";
import { Text } from "../../components/ui/text";
import { Icon } from "../../components/ui/icon";
import { Spinner } from "../../components/ui/spinner";
import { PaperclipIcon, SendHorizonalIcon, XIcon } from "lucide-react-native";
import {
  getAllAccounts,
  getAllGategoriesByType,
  autoExtractTransactions,
} from "../../libs/api";
import type {
  Category,
  Transaction,
  FailedItem,
  TransactionWithCategory,
} from "../../libs/api";
import { TransactionItem } from "../../components/transaction-item";
import { useImagePicker } from "../../hooks/use-image-picker";
import colors from "tailwindcss/colors";

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
    <Box className="mb-2 self-start">
      <Box className="rounded-2xl rounded-tl-sm bg-background-100 px-4 py-3">
        <Spinner size="small" />
      </Box>
    </Box>
  );
}

function ErrorBubble({ message }: { message: string }) {
  return (
    <Box className="mb-2 self-start">
      <Box className="rounded-2xl rounded-tl-sm border border-error-200 bg-background-error px-4 py-3">
        <Text size="sm" className="text-error-600">
          {message}
        </Text>
      </Box>
    </Box>
  );
}

function FailureBubble({ item }: { item: FailedItem }) {
  return (
    <Box className="mb-1 self-start">
      <Box className="rounded-2xl rounded-tl-sm border border-warning-200 bg-background-warning px-4 py-2">
        <Text size="sm" className="text-warning-600">
          {`Item ${item.item}: ${item.reason}`}
        </Text>
      </Box>
    </Box>
  );
}

interface ResultMessageViewProps {
  message: ResultMessage;
  categories: Category[];
}

function ResultMessageView({ message, categories }: ResultMessageViewProps) {
  if (message.created.length === 0 && message.failed.length === 0) {
    return (
      <Box className="mb-2 self-start">
        <Box className="rounded-2xl rounded-tl-sm bg-background-100 px-3 py-2">
          <Text className="text-typography-500">ไม่พบรายการที่ประมวลผลได้</Text>
        </Box>
      </Box>
    );
  }

  return (
    <VStack space="xs" className="mb-2 w-full max-w-xs self-start">
      {message.created.map((tx) => {
        const data: TransactionWithCategory = {
          ...tx,
          categoryId: categories.find((c) => c._id === tx.categoryId)!,
        };
        return <TransactionItem key={tx._id} data={data} />;
      })}
      {message.failed.map((item, idx) => (
        <FailureBubble key={idx} item={item} />
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
    <Box className="mb-2 max-w-xs self-end">
      {imageUri ? (
        <Image
          size="none"
          source={{ uri: imageUri }}
          alt="user uploaded image"
          className="mb-1 h-40 w-40 self-end rounded-2xl"
          resizeMode="cover"
        />
      ) : null}
      {text ? (
        <Box className="rounded-2xl rounded-tr-sm bg-primary-500 px-4 py-3">
          <Text size="sm" className="text-typography-0">
            {text}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

export function AutoTransactionScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [imageMime, setImageMime] = useState<string | undefined>(undefined);
  const [isSending, setIsSending] = useState<boolean>(false);

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

  const sendEnabled =
    !isSending && (text.trim().length > 0 || imageUri !== undefined);

  const handleSend = async () => {
    if (!sendEnabled) return;

    const account = accountsQuery.data?.[0];
    if (!account) return;

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

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    const capturedText = text;
    const capturedImageUri = imageUri;
    const capturedImageMime = imageMime;
    setText("");
    setImageUri(undefined);
    setImageMime(undefined);
    setIsSending(true);

    try {
      const result = await autoExtractTransactions({
        accountId: account._id,
        currency: account.currency,
        text: capturedText || undefined,
        imageUri: capturedImageUri,
        imageMime: capturedImageMime,
      });

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
    } catch (error: unknown) {
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
    } finally {
      setIsSending(false);
    }
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
      return <ResultMessageView message={item} categories={categories} />;
    }
    if (item.role === "error") {
      return <ErrorBubble message={item.message} />;
    }
    return null;
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background-100">
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <VStack className="flex-1">
          <FlatList
            data={[...messages].reverse()}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            inverted
            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
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
                  <Pressable
                    onPress={() => setImageUri(undefined)}
                    className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full bg-typography-700"
                  >
                    <Icon as={XIcon} size="xs" className="text-typography-0" />
                  </Pressable>
                </Box>
              </Box>
            ) : null}

            <HStack space="sm" className="items-end px-4 py-3">
              <Pressable
                onPress={handleAttach}
                className="mb-0.5 h-10 w-10 items-center justify-center rounded-full border border-outline-200"
              >
                <Icon
                  as={PaperclipIcon}
                  size="md"
                  className="text-typography-500"
                />
              </Pressable>

              <Input
                className="flex-1 rounded-2xl border-outline-300 bg-background-50 px-3 py-2"
                variant="outline"
              >
                <InputField
                  value={text}
                  onChangeText={setText}
                  placeholder="อธิบายรายการของคุณ..."
                  placeholderTextColor={colors.gray[400]}
                  multiline
                  style={{ maxHeight: 100, fontSize: 14 }}
                />
              </Input>

              <Pressable
                onPress={handleSend}
                disabled={!sendEnabled}
                className="mb-0.5 h-10 w-10 items-center justify-center rounded-full bg-primary-500 data-[disabled=true]:opacity-40"
              >
                {isSending ? (
                  <Spinner className="text-typography-0" size="small" />
                ) : (
                  <Icon
                    as={SendHorizonalIcon}
                    size="md"
                    className="text-typography-0"
                  />
                )}
              </Pressable>
            </HStack>
          </Box>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
