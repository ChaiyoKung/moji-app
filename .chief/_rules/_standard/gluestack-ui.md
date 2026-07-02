# Gluestack UI — Component Usage Rules

## Core Rule

**Never import layout or UI primitives directly from `react-native` when a Gluestack UI equivalent exists in `src/components/ui/`.**

## Mapping: react-native → Gluestack UI

| react-native | Gluestack UI | Path |
|---|---|---|
| `View` | `Box` | `src/components/ui/box/` |
| `Image` | `Image` | `src/components/ui/image/` |
| `TextInput` | `Input` + `InputField` | `src/components/ui/input/` |
| `Text` | `Text` | `src/components/ui/text/` |
| `Pressable` | `Pressable` | `src/components/ui/pressable/` |

## Rules

- Use `Box` (not `View`) for any layout container that only applies className styling.
- Use `Image` from `src/components/ui/image/` (not `react-native`). Pass `size="none"` for arbitrary sizing via className. **Always include an `alt` prop** with a short descriptive string (e.g. `alt="user uploaded image"`).
- Use `InputField` from `src/components/ui/input/` (not `TextInput` directly). Wrap with `Input` when you need the border/variant styling; use bare `InputField` when you control the container styling yourself.
- Use `Text` from `src/components/ui/text/` — never `<Text>` from `react-native`.
- Use `Pressable` from `src/components/ui/pressable/` — never `TouchableOpacity` or `react-native`'s `Pressable`.

## Exceptions

- `react-native` primitives may be used **inside** `src/components/ui/` implementation files themselves.
- `SafeAreaView` from `react-native-safe-area-context` and `FlatList`/`ScrollView`/`KeyboardAvoidingView` (layout/scroll containers) from `react-native` or `react-native-keyboard-controller` have no Gluestack equivalent — these remain as-is.
- When a Gluestack component does not support a required native prop, a direct `react-native` import is acceptable with an inline comment explaining why.

## Example

```tsx
// ✅ Correct
import { Box } from "../../components/ui/box";
import { Image } from "../../components/ui/image";
import { Input, InputField } from "../../components/ui/input";

<Box className="flex-1 bg-background-0">
  <Image size="none" source={{ uri }} alt="description of image" className="h-40 w-40 rounded-2xl" resizeMode="cover" />
  <InputField value={text} onChangeText={setText} multiline style={{ maxHeight: 100 }} />
</Box>

// ❌ Wrong
import { View, Image, TextInput } from "react-native";
```
