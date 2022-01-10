import {
  StateUpdater,
  useState,
  useEffect,
  useLayoutEffect,
} from "preact/hooks";

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, StateUpdater<T>] {
  const [v, setV] = useState(() => {
    let v = localStorage.getItem(key);
    return v ? JSON.parse(v) : initialValue;
  });

  // When value changes, update local storage
  useEffect(() => {
    if (v) {
      localStorage.setItem(key, JSON.stringify(v));
    }
  }, [v]);

  // Reset state when key changes
  useLayoutEffect(() => {
    setV(() => {
      let newV = localStorage.getItem(key);
      return newV ? JSON.parse(newV) : initialValue;
    });
  }, [key]);
  return [v, setV];
}
