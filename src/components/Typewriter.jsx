import { useEffect, useRef, useState } from "react";

const DEFAULT_TYPE_MS = 110;
const DEFAULT_DELETE_MS = 55;
const DEFAULT_HOLD_MS = 1600;

export default function Typewriter({
  words,
  className = "",
  typeSpeed = DEFAULT_TYPE_MS,
  deleteSpeed = DEFAULT_DELETE_MS,
  holdTime = DEFAULT_HOLD_MS,
}) {
  const list = words?.length ? words : [""];
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing");
  const timeoutRef = useRef(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) {
      setText(list[0]);
      return undefined;
    }

    const current = list[wordIndex % list.length];

    if (phase === "typing") {
      if (text.length < current.length) {
        timeoutRef.current = window.setTimeout(() => {
          setText(current.slice(0, text.length + 1));
        }, typeSpeed);
      } else {
        timeoutRef.current = window.setTimeout(() => setPhase("deleting"), holdTime);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeoutRef.current = window.setTimeout(() => {
          setText(current.slice(0, text.length - 1));
        }, deleteSpeed);
      } else {
        setPhase("typing");
        setWordIndex((index) => (index + 1) % list.length);
      }
    }

    return () => window.clearTimeout(timeoutRef.current);
  }, [text, phase, wordIndex, list, typeSpeed, deleteSpeed, holdTime, prefersReduced]);

  return (
    <span className={className}>
      <span>{text || "\u00A0"}</span>
      {!prefersReduced && <span className="typewriter-caret" aria-hidden="true" />}
    </span>
  );
}
