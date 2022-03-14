export function Square(props: {
  letter?: string;
  index: number;
  guess?: string;
  isCurrentTry: boolean;
  word: string;
  tries: string[];
}) {
  const { index, letter, word, isCurrentTry, guess, tries } = props;
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

  const numberOfOccurrencesInGuess =
    guess?.split("").filter((l) => l === letter).length ?? 0;

  const indicesOfOccurrencesInGuess =
    guess?.split("").map((l) => (l === letter ? 1 : 0)) || [];

  const numberOfOccurrencesInWord = word
    .split("")
    .filter((l) => l === letter).length;

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

  // warn if the letter is already known to not exist
  const warn =
      isCurrentTry
      && letter
      && word.indexOf(letter) === -1
      && tries.some((t) => t.indexOf(letter) > -1);

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
          : warn
          ? "var(--letter-bg--warn)"
          : "var(--letter-bg)",
      }}
    >
      {letter}
    </div>
  );
}
