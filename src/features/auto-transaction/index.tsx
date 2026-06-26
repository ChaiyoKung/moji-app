import React, { useState, useCallback, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Image,
  ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "../../components/ui/pressable";
import { HStack } from "../../components/ui/hstack";
import { VStack } from "../../components/ui/vstack";
import { Text } from "../../components/ui/text";
import { Icon } from "../../components/ui/icon";
import { Spinner } from "../../components/ui/spinner";
import { PaperclipIcon, SendHorizonalIcon, XIcon } from "lucide-react-native";
import type { ChatMessage, ResultMessage } from "./types";
import { LoadingBubble } from "./components/LoadingBubble";
import { ErrorBubble } from "./components/ErrorBubble";
import { FailureBubble } from "./components/FailureBubble";
import { DraftTransactionCard } from "./components/DraftTransactionCard";

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "1", role: "user", text: "Coffee 80 baht", timestamp: Date.now() },
  { id: "2", role: "loading", timestamp: Date.now() },
];

function ResultMessageView({ message }: { message: ResultMessage }) {
  return (
    <VStack space="xs" className="mb-2 w-full max-w-xs self-start">
      {message.created.map((tx) => (
        <DraftTransactionCard
          key={tx._id}
          transaction={tx}
          category={undefined}
          onPress={(id) => console.log("pressed draft:", id)}
        />
      ))}
      {message.failed.map((item, idx) => (
        <FailureBubble key={idx} item={item} />
      ))}
    </VStack>
  );
}

function UserBubble({ text, imageUri }: { text?: string; imageUri?: string }) {
  return (
    <View className="mb-2 max-w-xs self-end">
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="mb-1 h-40 w-40 self-end rounded-2xl"
          resizeMode="cover"
        />
      ) : null}
      {text ? (
        <View className="rounded-2xl rounded-tr-sm bg-primary-500 px-4 py-3">
          <Text size="sm" className="text-typography-0">
            {text}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export function AutoTransactionScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const sendEnabled =
    !isSending && (text.trim().length > 0 || imageUri !== undefined);

  const handleSend = useCallback(() => {
    if (!sendEnabled) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text || undefined,
      imageUri,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setImageUri(undefined);
    setIsSending(true);
    // Placeholder: real API wired in task-5
    setTimeout(() => setIsSending(false), 0);
    console.log("send:", { text, imageUri });
  }, [sendEnabled, text, imageUri]);

  const handleAttach = useCallback(() => {
    console.log("attach image tapped");
  }, []);

  const renderItem: ListRenderItem<ChatMessage> = useCallback(({ item }) => {
    if (item.role === "user") {
      return <UserBubble text={item.text} imageUri={item.imageUri} />;
    }
    if (item.role === "loading") {
      return <LoadingBubble />;
    }
    if (item.role === "result") {
      return <ResultMessageView message={item} />;
    }
    if (item.role === "error") {
      return <ErrorBubble message={item.message} />;
    }
    return null;
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background-0">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <VStack className="flex-1">
          {/* Header */}
          <View className="border-b border-outline-200 px-4 py-3">
            <Text size="lg" bold>
              Auto Transaction
            </Text>
          </View>

          {/* Message Feed */}
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            inverted
            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          />

          {/* Input Action Bar */}
          <View className="border-t border-outline-200 bg-background-0">
            {/* Image thumbnail preview */}
            {imageUri ? (
              <View className="px-4 pt-3">
                <View className="relative self-start">
                  <Image
                    source={{ uri: imageUri }}
                    className="h-20 w-20 rounded-xl"
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => setImageUri(undefined)}
                    className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full bg-typography-700"
                  >
                    <Icon as={XIcon} size="xs" className="text-typography-0" />
                  </Pressable>
                </View>
              </View>
            ) : null}

            <HStack space="sm" className="items-end px-4 py-3">
              {/* Attachment button */}
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

              {/* Text input */}
              <View className="flex-1 rounded-2xl border border-outline-300 bg-background-50 px-3 py-2">
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Describe your transaction..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  style={{ maxHeight: 100, fontSize: 14, color: "#111827" }}
                />
              </View>

              {/* Send button */}
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
          </View>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
