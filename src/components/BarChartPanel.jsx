export default function BarChartPanel({ title, items, emptyLabel = "No data yet" }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80">
      <h2 className="text-sm font-semibold text-navy">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-6 text-center text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.slice(0, 6).map(({ label, count }) => (
            <li key={label}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium text-slate-600">{label}</span>
                <span className="shrink-0 font-bold text-navy">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-blue transition-all duration-500"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function HourlyChartPanel({ title, items, peakHour }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  const activeHours = items.filter((i) => i.count > 0);

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-navy">{title}</h2>
        {peakHour && peakHour !== "—" && (
          <span className="text-xs font-medium text-brand-blue">Peak: {peakHour}</span>
        )}
      </div>
      {activeHours.length === 0 ? (
        <p className="mt-6 text-center text-sm text-slate-400">Check-ins will appear here live</p>
      ) : (
        <div className="mt-4 flex items-end gap-1" style={{ height: "120px" }}>
          {items.map(({ hour, count }) => (
            <div key={hour} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div
                className="w-full rounded-t bg-brand-blue/80 transition-all duration-500"
                style={{ height: `${Math.max((count / max) * 100, count > 0 ? 8 : 0)}%`, minHeight: count > 0 ? "4px" : 0 }}
                title={`${hour}:00 — ${count}`}
              />
              {count > 0 && <span className="text-[9px] font-bold text-navy">{count}</span>}
              <span className="text-[8px] text-slate-400">{hour}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
