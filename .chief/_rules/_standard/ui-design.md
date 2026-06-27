# UI Design Rules

## Page Layout

- Tab bar screens (`src/app/(tabs)/`) must NEVER render their own header — the tab layout sets `headerShown: false`. Do not add a `<View>` header block inside tab screens.
- All screens: `<SafeAreaView edges={["top"]} className="flex-1 bg-background-100">`.
- Content in `<ScrollView>` uses `<VStack space="md" className="p-4">` inside.
- Bottom-pinned content (FABs, input bars) uses `pb-[5.75rem]` padding to clear the tab bar.
- Screens with a sticky bottom action bar use a Fragment wrapper: `<KeyboardAwareScrollView>` for scrollable content + `<SafeAreaView edges={["bottom"]}>` for the pinned bar.
- Multiple `SafeAreaView` per screen is acceptable when scroll content needs different edge handling (e.g. `edges={["top"]}` on outer + `edges={["bottom"]}` on sticky bar).
- Forms use `<KeyboardAwareScrollView>` from `react-native-keyboard-controller` as the scroll container.

## Cards

- Card container: `rounded-2xl border border-outline-200 bg-background-0 p-4`.
- Cards that represent a list item are wrapped in `<Pressable>` with a `rounded-2xl` container.
- Hover/press feedback is handled by Gluestack `Pressable` automatically.
- Do NOT add manual shadow classes unless matching an existing card (e.g. `shadow-soft-1`).

## Category Display

- Show category as a colored circle (matching `categoryId.color`) with the emoji icon inside.
- Circle size: `h-12 w-12 rounded-full` with `style={{ backgroundColor: category.color }}`.
- Emoji text inside the circle: `<Text size="2xl">{category.icon}</Text>`.
- Fallback when category is unknown: show a neutral circle with `?` icon.

## Amount Display

- Always use `<AmountText>` from `src/components/amount-text/` for monetary values.
- For draft transactions: `<AmountText type={transaction.type} value={transaction.amount} bold size="4xl" showSign />`.
- Show `"—"` as plain `<Text>` when `amount` is undefined.

## Badges

- Use `<Badge>` from `src/components/ui/badge/` for status indicators.
- Income: `action="success"`, Expense: `action="error"`, Draft: `action="warning" variant="outline"`.
- Badge placement: top-left for type, top-right for status (Draft).

## Empty & Error States

- Empty state: `<Center className="h-40 px-4"><Text className="text-typography-500">ไม่พบข้อมูล</Text></Center>`.
- Error state: `<Center className="h-40 px-4"><Text className="text-error-500">ไม่สามารถโหลดข้อมูลได้</Text></Center>`.
- Loading state: `<Center className="h-40 px-4"><Spinner /></Center>`.

## Chat Bubbles (Auto Transaction screen)

- User bubble: `bg-primary-500`, aligned right (`self-end`), `rounded-2xl rounded-tr-sm`.
- System bubble (loading, error, failure): `bg-background-100`, aligned left (`self-start`), `rounded-2xl rounded-tl-sm`.
- Error bubble: add `border border-error-200 bg-background-error` with `text-error-600`.
- Warning/failure bubble: `border border-warning-200 bg-background-warning` with `text-warning-600`.

## Input Bar

- Sits at the bottom of the screen, above keyboard: `KeyboardAvoidingView` wrapping the screen.
- Input bar border: `border-t border-outline-200 bg-background-0`.
- Text input: `rounded-2xl border border-outline-300 bg-background-50 px-3 py-2`.
- Action buttons (attach, send): `h-10 w-10 rounded-full` circles.
- Send button: `bg-primary-500`; disabled state: `data-[disabled=true]:opacity-40`.

## Icons

- Import from `lucide-react-native`.
- Render with `<Icon as={SomeIcon} size="md" className="text-..." />`.
- Tab icons: size `"xl"`.
