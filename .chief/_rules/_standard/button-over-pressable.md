# Use Gluestack Button components for interactive action buttons

**Why:** Raw `Pressable` + `Icon` + `Spinner` requires manual disabled-state styling, spinner color wiring, and ad-hoc Tailwind sizing. Gluestack `Button` handles all of this via `action`, `variant`, `isDisabled`, `ButtonIcon`, and `ButtonSpinner` props.

**How to apply:** Whenever adding a tappable element that triggers an action (send, attach, submit, delete, etc.), use `Button` + `ButtonIcon` / `ButtonSpinner`. Only use bare `Pressable` for non-button interactive areas (e.g. list rows, overlays).

## Example

```tsx
// ✅ correct
<Button action="secondary" variant="outline" onPress={handleAttach} className="aspect-square rounded-full">
  <ButtonIcon as={PaperclipIcon} />
</Button>

<Button onPress={handleSend} isDisabled={!sendEnabled} className="aspect-square rounded-full">
  {isPending ? <ButtonSpinner /> : <ButtonIcon as={SendHorizonalIcon} />}
</Button>

// ❌ avoid
<Pressable onPress={handleAttach} className="h-10 w-10 items-center justify-center rounded-full border border-outline-200">
  <Icon as={PaperclipIcon} size="md" className="text-typography-500" />
</Pressable>
```
