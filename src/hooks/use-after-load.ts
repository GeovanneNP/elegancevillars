import { useEffect, useState } from "react";

/** True once the window `load` event has fired and the browser has had an idle moment. */
export function useAfterLoad() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const go = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(() => setOn(true), { timeout: 1000 });
      else setTimeout(() => setOn(true), 100);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);
  return on;
}
