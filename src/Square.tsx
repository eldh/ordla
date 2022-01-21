export function Square(props: {
  letter?: string;
  index: number;
  guess?: string;
  isCurrentTry: boolean;
  word: string;
}) {
  const { index, letter, word, isCurrentTry, guess } = props;
  const hit = !isCurrentTry && word[index] === letter;
  const letterOccurrances = word.split("").filter((l) => l === letter).length;
  const letterHitsElsewhere =
    (!hit &&
      guess?.split("").filter((l2, i) => word[i] === l2 && l2 === letter)
        .length) ||
    0;

  const almost =
    letter &&
    !isCurrentTry &&
    !hit &&
    (letterOccurrances > 1
      ? letterHitsElsewhere < letterOccurrances
      : letterHitsElsewhere === 0) &&
    word.indexOf(letter) > -1;
  return (
    <div
      className="center letter"
      style={{
        fontSize: "24px",
        textTransform: "uppercase",
        boxShadow:
          "0 2px 5px var(--shadow-mid), 0 1px 0 rgba(255, 255, 255, 0.15) inset, 0 -1px 0 rgba(0, 0, 0, 0.2) inset",
        backgroundColor: " var(--letter-bg)",
        borderRadius: "6px",
        padding: "6px",
        flexShrink: 1,
        background: hit
          ? "var(--letter-bg--hit)"
          : almost
          ? "var(--letter-bg--almost)"
          : "var(--letter-bg)",
      }}
    >
      {letter}
    </div>
  );
}
