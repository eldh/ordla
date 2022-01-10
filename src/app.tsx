import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "preact/hooks";
import { Fade } from "./Fade";
import { Help } from "./Help";
import { Keyboard } from "./Keyboard";
import { SummaryModal } from "./SummaryModal";
import { Tries } from "./Tries";
import { usePersistedState } from "./usePersistedState";
import { useTimer } from "./useTimer";
import { useViewportHeight } from "./useViewportHeight";
import { words } from "./words";

export function App() {
  const [, endOfDay] = useTimer(10000);
  const word = useMemo(() => {
    return getWordForDay(endOfDay);
  }, [endOfDay]);
  const [tries, setTries] = usePersistedState<string[]>("tries_" + word, []);
  const [currentTry, setCurrentTry] = useState("");
  const [warning, setWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hasWon = useMemo(() => tries[tries.length - 1] === word, [tries]);
  const hasLost = useMemo(() => !hasWon && tries.length === 6, [tries, hasWon]);
  const height = useViewportHeight();
  useEffect(() => {
    if (warning) {
      const v = setTimeout(() => {
        setWarning(false);
      }, 2000);
      return () => clearTimeout(v);
    }
  }, [warning]);
  useEffect(() => {
    if (hasWon || hasLost) {
      const results = JSON.parse(localStorage.getItem("results") ?? "{}");
      localStorage.setItem(
        "results",
        JSON.stringify({ ...results, [word]: hasLost ? -1 : tries.length })
      );
    }
  }, [hasWon, hasLost]);
  useLayoutEffect(() => {
    if (hasWon || hasLost) {
      setShowModal(true);
    }
  }, [hasWon, hasLost]);
  useEffect(() => {
    setShowModal(false);
  }, [word]);
  const handlePress = useCallback(
    (key: string) => {
      if (key === "Backspace") {
        setCurrentTry((v) => v.substring(0, v.length - 1));
      } else if (key === "Enter") {
        if (hasWon) {
          setShowModal(true);
        }
        const isAWord =
          currentTry.length === 5 && words.indexOf(currentTry) > -1;
        if (isAWord) {
          setTries((t) => [...t, currentTry]);
          setCurrentTry("");
        } else {
          setWarning(true);
        }
      } else if (!hasWon) {
        setCurrentTry((value) => (value.length < 5 ? value + key : value));
      }
    },
    [currentTry]
  );

  return (
    <div className="center" style={{ height: `${height}px` }}>
      <Help />
      <Fade show={warning}>{(c) => <Warning className={c} />}</Fade>
      <Fade show={showModal}>
        {(c) => (
          <SummaryModal
            tries={tries}
            word={word}
            className={c}
            onClose={() => setShowModal(false)}
          />
        )}
      </Fade>
      <h2>Ordla</h2>
      <Tries word={word} tries={tries} currentTry={currentTry} />
      <Keyboard word={word} tries={tries} onPress={handlePress} />
    </div>
  );
}

function Warning({ className }: { className: string }) {
  return (
    <div className={"warning " + className}>
      Ordet finns inte med i ordlistan.
    </div>
  );
}

// Pick a start date
const inception =
  new Date(1641680371437).setUTCHours(0, 0, 0, 0).valueOf() /
  (1000 * 60 * 60 * 24);

function getWordForDay(date: Date) {
  const today = date.setUTCHours(0, 0, 0, 0);
  const index = today / (1000 * 60 * 60 * 24);
  return words[(words.length / 2 + (index - inception)) % words.length];
}
