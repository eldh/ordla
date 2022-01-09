import { useEffect, useState } from "preact/hooks";
import { Fade } from "./Fade";
import { Square } from "./Square";
import { usePersistedState } from "./usePersistedState";

export function Help({}: { className: string }) {
  const [help, setHelp] = useState(false);
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className="help-btn"
        onClick={() => setHelp(true)}
      >
        ?
      </div>
      <Fade show={help}>
        {(className) => (
          <>
            <div
              className={"modal gap-xl " + className}
              style={{ width: "calc(100% - 24px)" }}
            >
              <div
                role="button"
                onClick={() => setHelp(false)}
                className="close-btn"
              >
                ⨯
              </div>
              <h3>Hur spelar man?</h3>
              <p>
                Du har 6 försök på dig att gissa ordet. Brickorna visar vilka
                bokstäver i dina gissningar som är rätt.
              </p>
              <Example word="sneda" guess="sjung" />
              <p>
                I examplet ovan är <b>S</b> på rätt plats i ordet och <b>N</b>{" "}
                finns i ordet men är på fel plats. På tangentbordet syns vilka
                bokstäver som är med i ordet och vilka som inte är med.
              </p>
              <p>Varje dag kommer ett nytt ord.</p>
            </div>
            <div className={"modal-bg " + className} />
          </>
        )}
      </Fade>
    </>
  );
}
function Example({ word, guess }: { word: string; guess: string }) {
  return (
    <div className="row gap-s">
      {guess.split("").map((l, i) => (
        <Square word={word} letter={l} key={l} index={i} isCurrentTry={false} />
      ))}
    </div>
  );
}
