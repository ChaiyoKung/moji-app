import { useState } from "react";

/**
 * useToggle - A reusable hook for toggling boolean state.
 * @param initial Initial boolean value (default: false)
 * @returns [state, toggle, setState]
 */
export function useToggle(initial: boolean = false) {
  const [state, setState] = useState<boolean>(initial);

  const toggle = () => setState((prev) => !prev);

  return [state, toggle, setState] as const;
}
