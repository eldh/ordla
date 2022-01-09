import { ComponentChildren } from "preact";
import { useEffect, useLayoutEffect, useState } from "preact/hooks";

export function Fade(props: {
  children(className: string): ComponentChildren;
  show: boolean;
}) {
  const { show, children } = props;
  const [render, setRender] = useState(show);
  const [render1, setRender1] = useState(show);
  useEffect(() => {
    if (!show) {
      let v = setTimeout(() => {
        setRender(false);
        setRender1(false);
      }, 1000);
      return () => {
        clearTimeout(v);
      };
    } else {
      setRender(true);
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      setRender1(true);
    }
  }, [render]);

  return (
    <>
      {render ? children("fade " + (render1 && show ? "fade-in" : "")) : null}
    </>
  );
}
