# State Management Rules

## Zustand Store Patterns

Two store patterns — choose based on whether the store is needed outside React:

**Vanilla store** (`createStore`) — when the store must be accessed outside React components (e.g. axios interceptors):
```ts
// stores/session-store.ts
export const sessionStore = createStore<SessionState>()(persist(...));
// Wrap in a custom hook for React usage:
// hooks/use-session-store.ts
export function useSessionStore<T>(selector?: (state: SessionState) => T) {
  return useStore(sessionStore, selector!);
}
```

**React store** (`create`) — when the store is only accessed inside React components:
```ts
// stores/use-setting-store.ts
export const useSettingStore = create<SettingState>()(persist(...));
```

## Selector Pattern

Always pass a selector to avoid unnecessary re-renders. Each piece of state = separate call:
```ts
const isBalanceHidden = useSettingStore((state) => state.isBalanceHidden);
const toggleHideBalance = useSettingStore((state) => state.toggleHideBalance);
```

Never subscribe to the entire store without a selector.

## Store State Typing

Use `interface` (not `type`) for Zustand state shapes:
```ts
export interface SessionState { ... }  // exported if needed externally
interface SettingState { ... }         // unexported if internal only
```

## Persistence Storage

- Sensitive data (auth tokens, session): use `SecureStorage`.
- Non-sensitive preferences (settings): use `AsyncStorage`.
