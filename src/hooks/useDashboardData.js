import { useEffect, useMemo, useState } from "react";
import { computeStatsFromAttendees } from "../data/dummyAttendees";
import { api } from "../lib/api";

export function useDashboardData(refreshMs = 5000) {
  const [stats, setStats] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [statsData, list] = await Promise.all([api.getStats(), api.listAttendees()]);
        if (!active) return;

        const rows = Array.isArray(list) ? list : [];
        setAttendees(rows);
        setStats({ ...statsData, ...computeStatsFromAttendees(rows) });
        setError("");
        setLastUpdated(new Date());
      } catch (err) {
        if (!active) return;
        setAttendees([]);
        setStats(null);
        setError(err.message);
        setLastUpdated(new Date());
      }
    }

    load();
    const interval = setInterval(load, refreshMs);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [refreshMs]);

  const recentActivity = useMemo(
    () =>
      [...attendees]
        .sort((a, b) => {
          const aTime = a.checkedInAt || a.createdAt;
          const bTime = b.checkedInAt || b.createdAt;
          return new Date(bTime) - new Date(aTime);
        })
        .slice(0, 12),
    [attendees]
  );

  const checkedInList = useMemo(
    () => attendees.filter((a) => a.checkedIn).slice(0, 8),
    [attendees]
  );

  return { stats, attendees, error, lastUpdated, recentActivity, checkedInList };
}
