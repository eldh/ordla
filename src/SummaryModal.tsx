import { useEffect, useState } from "preact/hooks";
import { Fade } from "./Fade";
import { usePersistedState } from "./usePersistedState";
import { useTimer } from "./useTimer";

export function SummaryModal({
  className,
  onClose,
  tries,
  word,
}: {
  onClose(): void;
  className: string;
  tries: string[];
  word: string;
}) {
  const [results] = usePersistedState<Record<string, number>>("results", {});

  const guessDistribution = Object.values(results).reduce(
    (memo, v) => {
      memo[v - 1] = memo[v - 1] + 1;
      return [...memo];
    },
    [0, 0, 0, 0, 0, 0]
  );
  const maxWins = Math.max(...guessDistribution);
  return (
    <>
      <div className={"modal center gap-m " + className}>
        <div role="button" tabIndex={0} onClick={onClose} className="close-btn">
          ⨯
        </div>
        <h3>Statistik</h3>
        <p>
          Dagens ord:{" "}
          <a
            href={`https://sv.wiktionary.org/wiki/${word}`}
            className="capitalize"
            target="_new"
            rel="noreferrer noopener"
          >
            <b>{word}</b>
          </a>
        </p>
        <div className="row gap-m center">
          <Stat number={Object.keys(results).length} label="Spelade" />
          <Stat
            number={Object.values(results).filter((v) => v > 0).length}
            label="Vinster"
          />
        </div>
        <div className="gap-m center grow">
          <div style={{ fontSize: "1rem", fontWeight: "600" }}>Gissningar</div>
          <div className="gap-s grow">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Bar
                number={i}
                maxWins={maxWins}
                wins={guessDistribution[i - 1]}
                key={i}
              />
            ))}
          </div>
        </div>
        <div className="row gap-l" style={{ marginTop: "36px", gap: "56px" }}>
          <Next />
          <Share word={word} tries={tries} />
        </div>
      </div>
      <div className={"modal-bg " + className} />
    </>
  );
}

function Stat(props: { number: string | number; label: string }) {
  return (
    <div className="center">
      <div style={{ fontWeight: "900" }}>{props.number}</div>
      <div style={{ fontSize: "0.75rem" }}>{props.label}</div>
    </div>
  );
}

function Bar(props: { number: number; wins: number; maxWins: number }) {
  const { wins, maxWins, number } = props;

  return (
    <div
      className="center row gap-m"
      style={{
        width: "100%",
        flexGrow: "1",
        flexShrink: "0",
      }}
    >
      <div style={{ fontWeight: "900", fontSize: "1.25rem" }}>{number}</div>
      <div
        style={{
          fontWeight: "900",
          fontSize: "0.875rem",
          width: "100%",
        }}
      >
        <div
          style={{
            height: "24px",
            width: (wins / maxWins) * 100 + "%",
            alignItems: "flex-end",
            backgroundColor: wins > 0 ? "var(--bar-color)" : undefined,
            borderRadius: "4px",
            padding: wins > 0 ? "6px" : "6px 18px",
          }}
          className="center"
        >
          {wins}
        </div>
      </div>
    </div>
  );
}

function Next() {
  const [now, endOfDay] = useTimer();

  const hours = endOfDay.getUTCHours() - now.getUTCHours();
  const minutes = endOfDay.getUTCMinutes() - now.getUTCMinutes();
  const seconds = endOfDay.getUTCSeconds() - now.getUTCSeconds();
  let s = (n: number) => (n < 10 ? `0${n}` : n);

  return (
    <div className="center">
      <div style={{ fontSize: "0.75rem" }}>Nästa ord:</div>
      <div style={{ fontWeight: "900" }}>{`${s(hours)}:${s(minutes)}:${s(
        seconds
      )}`}</div>
    </div>
  );
}
function Share({ tries, word }: { word: string; tries: string[] }) {
  let resultsString = tries
    .map((t) =>
      t
        .split("")
        .map((l, i) => {
          const isMiss = word.indexOf(l) === -1;
          const isHit = word[i] === l;
          const hitIsElsewhere =
            !isHit &&
            t
              ?.split("")
              .filter((l2, i) => word[i] === l2)
              .includes(l);
          const isClose = !isHit;
          return isMiss || hitIsElsewhere ? "⬛" : isHit ? "🟩" : "🟨";
        })
        .join("")
    )
    .join("\n");

  const data = {
    url: window.location.href,
    text: `Ordla, ${new Date().getDate()} ${monthStr(new Date().getMonth())}:

${resultsString}
  `,
    title: "Ordla",
  };

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const v = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(v);
    }
  }, [copied]);

  return (
    <>
      <Fade show={copied}>
        {(c) => (
          <div style={{ top: "-20px" }} className={"warning " + c}>
            Resultatet har kopierats
          </div>
        )}
      </Fade>
      <button
        className="share-btn"
        onClick={() => {
          if (navigator.share) {
            navigator.share(data);
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(data.text);
            setCopied(true);
          } else {
            alert("Kunde inte dela");
          }
        }}
      >
        Dela
      </button>
    </>
  );
}

function monthStr(m: number) {
  return [
    "januari",
    "febriari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ][m];
}
