import { useEffect, useState } from "preact/hooks";

export function useTimer(delayMs: number = 1000) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const v = setInterval(() => {
      setNow(new Date());
    }, delayMs);
    return () => {
      clearInterval(v);
    };
  }, [delayMs]);
  const endOfDay = new Date(
    new Date(now.valueOf()).setUTCHours(23, 59, 59, 999)
  );

  return [now, endOfDay];
}
