import { useEffect, useState } from "preact/hooks";

export function Keyboard(props: {
  onPress: (key: string) => void;
  word: string;
  tries: string[];
}) {
  const { word, tries, onPress } = props;

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (flatKeys.includes(e.key) && !e.metaKey && !e.ctrlKey) {
        onPress(e.key);
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [onPress]);

  return (
    <div
      className="gap-s center"
      style={{ margin: "auto", padding: "6px", maxWidth: "calc(100vw - 12px)" }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="row gap-s"
          style={{ maxWidth: "calc(100vw - 12px)" }}
        >
          {keys[i].map((k) => (
            <Key word={word} tries={tries} key_={k} onPress={onPress} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Key(props: {
  key_: string;
  onPress: (key: string) => void;
  tries: string[];
  word: string;
}) {
  const { key_, onPress, tries, word } = props;
  const [pressed, setPressed] = useState(false);
  const hit = tries.some(
    (t) => t.indexOf(key_) > -1 && t.indexOf(key_) === word.indexOf(key_)
  );

  const almost =
    !hit && word.indexOf(key_) > -1 && tries.some((t) => t.indexOf(key_) > -1);
  const miss =
    word.indexOf(key_) === -1 && tries.some((t) => t.indexOf(key_) > -1);
  const key =
    key_ === "Backspace" ? (
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "1.5rem",
          lineHeight: "1.375rem",
        }}
      >
        {"←"}
      </span>
    ) : key_ === "Enter" ? (
      <span style={{ textTransform: "capitalize" }}>{"Enter"}</span>
    ) : (
      key_
    );
  return (
    <button
      className={
        "keyboard__key center" + (pressed ? " keyboard__key--pressed" : "")
      }
      onPointerDown={(e) => {
        onPress(key_);
        prevent(e);
        setPressed(true);
      }}
      onPointerUp={(e) => {
        prevent(e);
        setPressed(false);
      }}
      onPointerLeave={(e) => {
        setPressed(false);
      }}
      onPointerMove={(e) => {
        setPressed(false);
      }}
      style={{
        width: ["Enter", "Backspace"].includes(key_) ? "82px" : "38px",
        height: "38px",
        textTransform: "uppercase",
        flexShrink: 1,
        background: hit
          ? "var(--btn-bg--hit)"
          : almost
          ? "var(--btn-bg--almost)"
          : miss
          ? "var(--btn-bg--miss)"
          : "var(--btn-bg)",
      }}
    >
      {pressed ? <div className="key__pressed">{key}</div> : null}
      {key}
    </button>
  );
}

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];
const flatKeys = keys.reduce((memo, arr) => [...memo, ...arr], []);
function prevent(event: MouseEvent | TouchEvent) {
  event.preventDefault();
  event.stopPropagation();
}
