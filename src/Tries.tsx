import { Square } from "./Square";

export function Tries(props: {
  currentTry: string;
  word: string;
  tries: string[];
}) {
  const { tries, currentTry, word } = props;

  return (
    <div
      className="gap-s center"
      style={{ margin: "auto", padding: "6px", maxWidth: "calc(100vw - 12px)" }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div className="row center gap-s">
          {[0, 1, 2, 3, 4].map((j) => {
            const letter = [...tries, currentTry][i]?.[j];
            return (
              <Square
                index={j}
                isCurrentTry={i >= tries.length}
                word={word}
                letter={letter}
                key={"" + letter + i + j}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
