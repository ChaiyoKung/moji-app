# Contract C2 — Chat Message Data Model

## ChatMessage Union Type

All messages in the chat feed are typed discriminated-union entries stored in local React state (no persistence).

```ts
type ChatMessage =
  | UserMessage
  | LoadingMessage
  | ResultMessage
  | ErrorMessage;

/** Message sent by the user (text and/or image) */
interface UserMessage {
  id: string;           // uuid or Date.now() string
  role: "user";
  text?: string;        // Non-empty string if user typed text
  imageUri?: string;    // Local file URI of the cropped image
  timestamp: number;    // Date.now()
}

/** Typing indicator shown while API call is in-flight */
interface LoadingMessage {
  id: string;
  role: "loading";
  timestamp: number;
}

/** System response after API call completes (success or partial) */
interface ResultMessage {
  id: string;
  role: "result";
  created: DraftTransaction[];   // From API response (see C1)
  failed: FailedItem[];          // From API response (see C1)
  timestamp: number;
}

/** System message for a complete request failure */
interface ErrorMessage {
  id: string;
  role: "error";
  message: string;
  timestamp: number;
}
```

## State Management

- Messages are held in `useState<ChatMessage[]>` inside the chat screen component.
- On send: append `UserMessage`, then append `LoadingMessage`.
- On API success: replace `LoadingMessage` with `ResultMessage`.
- On API error: replace `LoadingMessage` with `ErrorMessage`.
- State resets to `[]` when the component unmounts (tab leave).

## Input State

```ts
interface ChatInputState {
  text: string;           // Controlled text input value
  imageUri?: string;      // Local URI of cropped image (undefined = no image)
  isSending: boolean;     // True while API call is in-flight
}
```

**Send enabled when:** `!isSending && (text.trim().length > 0 || imageUri !== undefined)`
