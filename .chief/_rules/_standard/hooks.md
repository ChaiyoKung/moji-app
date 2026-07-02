# Hooks Rule

## Rule

All React hooks must be globally reusable and live in `src/hooks/`.

- **File naming**: kebab-case — e.g. `use-image-picker.ts`, `use-toggle.ts`
- **No feature-local hooks**: do not place hooks inside `src/features/*/hooks/`. Always promote to `src/hooks/`.
- **One hook per file**: each file exports one primary hook.
- **Never inline hooks** into screen or component files.

## Examples

```
✅ src/hooks/use-image-picker.ts
✅ src/hooks/use-toggle.ts
✅ src/hooks/use-app-toast.tsx

❌ src/features/auto-transaction/hooks/useImagePicker.ts
❌ defining useXxx inside a screen component file
```
