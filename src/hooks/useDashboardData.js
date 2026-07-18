import { useEffect, useMemo, useState } from "react";
import { computeStatsFromAttendees, withDemoFallback } from "../data/dummyAttendees";
import { api } from "../lib/api";

export function useDashboardData(refreshMs = 5000) {
  const [stats, setStats] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [statsData, list] = await Promise.all([api.getStats(), api.listAttendees()]);
        if (!active) return;

        const { data, isDemo: demo } = withDemoFallback(list);
        setAttendees(data);
        setIsDemo(demo);
        setStats(
          demo ? computeStatsFromAttendees(data) : { ...statsData, ...computeStatsFromAttendees(data) }
        );
        setError("");
        setLastUpdated(new Date());
      } catch (err) {
        if (!active) return;
        const { data, isDemo: demo } = withDemoFallback([]);
        setAttendees(data);
        setIsDemo(demo);
        setStats(computeStatsFromAttendees(data));
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

  return { stats, attendees, isDemo, error, lastUpdated, recentActivity, checkedInList };
}
