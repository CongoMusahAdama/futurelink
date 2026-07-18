import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import EventLogo from "../components/EventLogo";
import Logo from "../components/Logo";
import { useDashboardData } from "../hooks/useDashboardData";

const EVENT_TITLE = "Ghana Hubs Network AGM 2026";
const EVENT_VENUE = "Kumasi · Mon 21 Jul 2026";

function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("en-GH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatClock(date) {
  return date.toLocaleTimeString("en-GH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TvDashboardPage() {
  const { stats, error, lastUpdated, checkedInList } = useDashboardData(5000);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    document.documentElement.classList.add("tv-dashboard");
    return () => document.documentElement.classList.remove("tv-dashboard");
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const rate = stats?.rate ?? 0;
  const checkedIn = stats?.checkedIn ?? 0;
  const total = stats?.total ?? 0;
  const pending = stats?.pending ?? 0;

  return (
    <div className="tv-screen">
      <div className="tv-screen-glow" aria-hidden />

      <header className="tv-screen-top">
        <div className="tv-screen-brand">
          <EventLogo variant="light" size="lg" />
          <div>
            <p className="tv-screen-kicker">Live attendance</p>
            <h1 className="tv-screen-title">{EVENT_TITLE}</h1>
            <p className="tv-screen-venue">{EVENT_VENUE}</p>
          </div>
        </div>

        <div className="tv-screen-top-right">
          <p className="tv-screen-clock">{formatClock(clock)}</p>
          <span className="tv-screen-live">
            <span className="tv-screen-live-dot" />
            <Radio className="h-5 w-5" />
            Live
          </span>
          <a href="#dashboard" className="tv-screen-exit" title="Exit TV mode">
            Exit
          </a>
        </div>
      </header>

      {error && (
        <p className="tv-screen-banner tv-screen-banner-error">Offline: {error}</p>
      )}

      {!stats ? (
        <div className="tv-screen-loading">Loading live stats…</div>
      ) : (
        <main className="tv-screen-main">
          <section className="tv-screen-stats" aria-label="Attendance summary">
            <div className="tv-screen-hero">
              <div
                className="tv-screen-ring"
                style={{ "--rate": rate }}
                aria-hidden
              >
                <div className="tv-screen-ring-inner">
                  <span className="tv-screen-hero-num">{checkedIn}</span>
                </div>
              </div>
              <p className="tv-screen-hero-label">Checked in</p>
            </div>

            <div className="tv-screen-cards">
              <div className="tv-screen-card">
                <span className="tv-screen-card-value">{total}</span>
                <span className="tv-screen-card-label">Registered</span>
              </div>
              <div className="tv-screen-card tv-screen-card-accent">
                <span className="tv-screen-card-value">{rate}%</span>
                <span className="tv-screen-card-label">Attendance</span>
              </div>
              <div className="tv-screen-card">
                <span className="tv-screen-card-value">{pending}</span>
                <span className="tv-screen-card-label">Pending</span>
              </div>
            </div>

            <div className="tv-screen-progress">
              <div className="tv-screen-progress-head">
                <span>Check-in progress</span>
                <span className="tv-screen-progress-pct">{rate}%</span>
              </div>
              <div className="tv-screen-progress-track">
                <div
                  className="tv-screen-progress-fill"
                  style={{ width: `${rate}%` }}
                />
              </div>
              <p className="tv-screen-progress-caption">
                {checkedIn} of {total} attendees
                {stats.peakHour && stats.peakHour !== "—" ? ` · Peak hour ${stats.peakHour}` : ""}
                {lastUpdated ? ` · Synced ${formatTime(lastUpdated)}` : ""}
              </p>
            </div>
          </section>

          <aside className="tv-screen-feed" aria-label="Latest check-ins">
            <h2 className="tv-screen-feed-title">Latest check-ins</h2>
            {checkedInList.length === 0 ? (
              <p className="tv-screen-feed-empty">Waiting for first check-in…</p>
            ) : (
              <ul className="tv-screen-feed-list">
                {checkedInList.slice(0, 10).map((a, i) => (
                  <li
                    key={a._id}
                    className={`tv-screen-feed-row${i === 0 ? " tv-screen-feed-row-new" : ""}`}
                  >
                    <span className="tv-screen-feed-initial">
                      {(a.fullName || "?").charAt(0).toUpperCase()}
                    </span>
                    <div className="tv-screen-feed-copy">
                      <span className="tv-screen-feed-name">{a.fullName}</span>
                      <span className="tv-screen-feed-role">{a.category || "Guest"}</span>
                    </div>
                    <span className="tv-screen-feed-time">{formatTime(a.checkedInAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </main>
      )}

      <footer className="tv-screen-foot">
        <Logo size="sm" variant="light" />
        <span>Future-Link Services · Event Intelligence</span>
      </footer>
    </div>
  );
}
