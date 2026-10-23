import { useEffect } from "react";
import { EVENT } from "../data/checkin";

/**
 * Switch the page into venue mode and re-skin it in the event's colours
 * (see .venue-event-theme in index.css). Cleans up on unmount.
 */
export function useVenueTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("venue-tablet");
    const theme = EVENT.ticketTheme;
    const vars = theme
      ? { "--ev-ink": theme.ink, "--ev-accent": theme.accent, "--ev-accent-ink": theme.accentInk, "--ev-bg": theme.bg }
      : {};
    if (theme) {
      root.classList.add("venue-event-theme");
      Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    }
    return () => {
      root.classList.remove("venue-tablet", "venue-event-theme");
      Object.keys(vars).forEach((k) => root.style.removeProperty(k));
    };
  }, []);
}
