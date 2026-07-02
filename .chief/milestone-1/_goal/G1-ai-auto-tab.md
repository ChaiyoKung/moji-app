# Goal G1 — AI Auto-Extraction Tab

## Summary
Add a new "Auto" tab to the bottom navigator that provides a chat-like interface for logging transactions via natural language and/or receipt images. The tab forwards input to the backend extraction API, displays draft transaction cards in the chat feed, and lets users navigate to the existing edit screen to confirm or discard each draft.

## Acceptance Criteria

1. **Tab visible** — A fourth tab labeled "Auto" with `SparklesIcon` appears in the bottom navigator between the existing tabs (or at the end).
2. **Chat feed** — Scrollable message feed showing user messages (text + image thumbnails) and system response cards.
3. **Draft cards** — Each item in the `created` array is rendered as a read-only card showing: type, amount (formatted), category name/icon, date (YYYY-MM-DD), note, and a "Draft" badge.
4. **Failure bubbles** — Each item in the `failed` array renders an informational text bubble with item index and reason.
5. **Error bubble** — A full-request failure renders a plain error message bubble.
6. **Loading indicator** — A typing indicator / skeleton loader is visible while awaiting the API response.
7. **Send button gated** — Send is disabled unless at least one of: text is non-empty OR an image is attached.
8. **Image flow** — Tapping the attachment button opens `react-native-image-crop-picker`; after picking/shooting, a cropper overlays; the approved cropped image appears as a thumbnail above the input bar.
9. **Navigate to edit** — Tapping a draft card navigates to `src/app/transactions/[id]/edit.tsx` with the draft transaction ID.
10. **Chat resets** — Message history clears when the user navigates away from the tab (no persistence).

## Out of Scope for This Milestone
- Confirming/deleting drafts directly from the chat screen (handled in edit.tsx)
- Account picker (auto-uses first account)
- Persisting chat history
- Push notifications for completed extractions
