# No Memoization

## Rule

Do NOT use any React memoization APIs:

- No `React.memo()`
- No `useMemo()`
- No `useCallback()`

## Rationale

Memoization adds complexity and is premature optimization in most cases. Use plain functions and values. If a genuine performance problem exists, reach for structural solutions (e.g. virtualized lists, query optimizations) rather than memoization.

## Examples

```tsx
// ❌ Wrong
const MyComponent = React.memo(({ data }) => <View />);
const value = useMemo(() => compute(x), [x]);
const handler = useCallback(() => doThing(), [dep]);

// ✅ Correct
function MyComponent({ data }: MyComponentProps) { return <View />; }
const value = compute(x);
const handler = () => doThing();
```
