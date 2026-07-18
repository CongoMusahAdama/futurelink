import { useEffect, useState } from "react";

function getTimeLeft(startsAt) {
  const diff = new Date(startsAt).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="event-countdown-unit">
      <span className="event-countdown-value">{String(value).padStart(2, "0")}</span>
      <span className="event-countdown-label">{label}</span>
    </div>
  );
}

export default function EventCountdown({
  startsAt,
  label = "Starts in",
  variant = "default",
  className = "",
}) {
  const [left, setLeft] = useState(() => (startsAt ? getTimeLeft(startsAt) : null));

  useEffect(() => {
    if (!startsAt) return undefined;
    const tick = () => setLeft(getTimeLeft(startsAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startsAt]);

  if (!startsAt) return null;

  const rootClass =
    variant === "hero"
      ? "event-countdown event-countdown-hero"
      : variant === "compact"
        ? "event-countdown event-countdown-compact"
        : variant === "splash"
          ? "event-countdown event-countdown-splash"
          : "event-countdown";

  if (!left) {
    return (
      <div className={`${rootClass} ${className}`.trim()}>
        <p className="event-countdown-live">Event is live</p>
      </div>
    );
  }

  if (variant === "splash") {
    return (
      <div className={`${rootClass} ${className}`.trim()}>
        {label && <p className="event-countdown-splash-label">{label}</p>}
        <div className="event-countdown-splash-row" role="timer" aria-live="polite">
          <CountdownUnit value={left.days} label="Days" />
          <span className="event-countdown-splash-sep" aria-hidden="true">
            :
          </span>
          <CountdownUnit value={left.hours} label="Hrs" />
          <span className="event-countdown-splash-sep" aria-hidden="true">
            :
          </span>
          <CountdownUnit value={left.minutes} label="Min" />
          <span className="event-countdown-splash-sep" aria-hidden="true">
            :
          </span>
          <CountdownUnit value={left.seconds} label="Sec" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${rootClass} ${className}`.trim()}>
      {label && <p className="event-countdown-heading">{label}</p>}
      <div className="event-countdown-grid" role="timer" aria-live="polite">
        <CountdownUnit value={left.days} label="Days" />
        <CountdownUnit value={left.hours} label="Hrs" />
        <CountdownUnit value={left.minutes} label="Min" />
        <CountdownUnit value={left.seconds} label="Sec" />
      </div>
    </div>
  );
}
