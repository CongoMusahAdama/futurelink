import { useEffect, useState } from "react";
import EventCountdown from "./EventCountdown";

const SHOW_MS = 4500;
const EXIT_MS = 600;

export default function HeroCountdownSplash({ startsAt, label }) {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setPhase("exit"), SHOW_MS);
    const hideTimer = window.setTimeout(() => setPhase("hidden"), SHOW_MS + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!startsAt || phase === "hidden") return null;

  return (
    <div
      className={`hero-countdown-splash hero-countdown-splash--${phase}`}
      role="status"
      aria-live="polite"
    >
      <div className="hero-countdown-splash-card">
        <EventCountdown
          startsAt={startsAt}
          label={label}
          variant="splash"
          className="hero-countdown-splash-inner"
        />
      </div>
    </div>
  );
}
