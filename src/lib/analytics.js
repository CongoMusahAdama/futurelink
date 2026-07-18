/** Group attendees into { label, count }[] sorted by count desc */
export function groupCount(attendees, keyFn, checkedInOnly = false) {
  const map = {};
  for (const a of attendees) {
    if (checkedInOnly && !a.checkedIn) continue;
    const key = keyFn(a)?.trim() || "Unknown";
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeHourlyCheckIns(attendees) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: String(i).padStart(2, "0"),
    count: 0,
  }));

  for (const a of attendees) {
    if (!a.checkedIn || !a.checkedInAt) continue;
    const h = new Date(a.checkedInAt).getHours();
    hours[h].count += 1;
  }

  return hours;
}

export function computePeakHour(hourly) {
  let peak = hourly[0];
  for (const row of hourly) {
    if (row.count > peak.count) peak = row;
  }
  return peak.count > 0 ? `${peak.hour}:00` : "—";
}

export function computeEventAnalytics(attendees) {
  const total = attendees.length;
  const checkedIn = attendees.filter((a) => a.checkedIn).length;
  const walkIns = attendees.filter((a) => a.isWalkIn).length;

  const byRegion = groupCount(attendees, (a) => a.region, true);
  const byCategory = groupCount(attendees, (a) => a.category, true);
  const byHour = computeHourlyCheckIns(attendees);

  return {
    total,
    checkedIn,
    walkIns,
    pending: total - checkedIn,
    rate: total ? Math.round((checkedIn / total) * 100) : 0,
    byRegion,
    byCategory,
    byHour,
    peakHour: computePeakHour(byHour),
  };
}
