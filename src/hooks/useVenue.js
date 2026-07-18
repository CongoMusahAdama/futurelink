import { useEffect, useState } from "react";
import { api, apiUrl } from "../lib/api";

export function useConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [apiOk, setApiOk] = useState(null);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    let active = true;
    async function ping() {
      try {
        const res = await fetch(apiUrl("/health"));
        if (active) setApiOk(res.ok);
      } catch {
        if (active) setApiOk(false);
      }
    }
    ping();
    const interval = setInterval(ping, 10000);

    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return { online, apiOk, connected: online && apiOk !== false };
}

export function useLiveStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await api.getStats();
        if (active) setStats(data);
      } catch {
        /* ignore */
      }
    }
    load();
    const interval = setInterval(load, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return stats;
}
