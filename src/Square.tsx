export function Square(props: {
  letter: string;
  index: number;
  guess?: string;
  isCurrentTry: boolean;
  word: string;
}) {
  const { index, letter, word, isCurrentTry, guess } = props;
  const hit = !isCurrentTry && word[index] === letter;
  const letterIsHitElsewhere =
    !isCurrentTry &&
    !hit &&
    guess
      ?.split("")
      .filter((l2, i) => word[i] === l2)
      .includes(letter);

  const numberOfOccurrencesInGuess =
    guess?.split("").filter((l) => l === letter).length ?? 0;

  const indicesOfOccurrencesInGuess =
    guess?.split("").map((l) => (l === letter ? 1 : 0)) || [];

  const numberOfOccurrencesInWord = word
    .split("")
    .filter((l) => l === letter).length;

  const almost =
    !letterIsHitElsewhere && !isCurrentTry && !hit && word.indexOf(letter) > -1;

  let couldBeExtranousAlmost =
    almost && numberOfOccurrencesInGuess > numberOfOccurrencesInWord;

  let isExtranousAlmost = couldBeExtranousAlmost;

  if (couldBeExtranousAlmost) {
    let count = numberOfOccurrencesInWord;
    for (let j = 0; j < 5; j++) {
      let v = indicesOfOccurrencesInGuess[j];
      if (v === 1) {
        count = count - 1;
        if (count < 0) {
          indicesOfOccurrencesInGuess[j] = 0;
        }
      }
    }
    isExtranousAlmost = indicesOfOccurrencesInGuess[index] !== 1;
  }

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
          : almost && !isExtranousAlmost
          ? "var(--letter-bg--almost)"
          : "var(--letter-bg)",
      }}
    >
      {letter}
    </div>
  );
}
