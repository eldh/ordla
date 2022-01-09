import { StateUpdater, useState, useEffect } from "preact/hooks";

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, StateUpdater<T>] {
  const [v, setV] = useState(() => {
    let v = localStorage.getItem(key);
    return v ? JSON.parse(v) : initialValue;
  });
  useEffect(() => {
    if (v) {
      localStorage.setItem(key, JSON.stringify(v));
    }
  }, [v]);
  return [v, setV];
}
