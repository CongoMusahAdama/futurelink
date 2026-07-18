import {
  Activity,
  Clock,
  RefreshCw,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import OpsShell from "../components/OpsShell";
import BarChartPanel, { HourlyChartPanel } from "../components/BarChartPanel";
import TableExportMenu from "../components/TableExportMenu";
import TablePagination from "../components/TablePagination";
import { useDashboardData } from "../hooks/useDashboardData";
import { usePagination } from "../hooks/usePagination";
import { ACTIVITY_EXPORT_COLUMNS } from "../lib/exportTable";

const STATION_LABELS = {
  "help-desk": "Help Desk",
  "fast-lane": "Fast Lane",
  vip: "VIP Desk",
};

const EVENT_TITLE = "Ghana Hubs Network AGM 2026";
const ACTIVITY_PAGE_SIZE = 8;

function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("en-GH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
  });
}

export default function LiveDashboardPage() {
  const { stats, attendees, error, lastUpdated, recentActivity, checkedInList } =
    useDashboardData(5000);

  const activityPagination = usePagination(recentActivity, ACTIVITY_PAGE_SIZE);
  const {
    page: activityPage,
    setPage: setActivityPage,
    paginatedItems: paginatedActivity,
    totalPages: activityTotalPages,
    totalItems: activityTotalItems,
    rangeStart: activityRangeStart,
    rangeEnd: activityRangeEnd,
  } = activityPagination;

  const exportProps = {
    columns: ACTIVITY_EXPORT_COLUMNS,
    rows: recentActivity,
    filename: "ghana-hubs-agm-activity",
    title: EVENT_TITLE,
    subtitle: "Recent activity",
    sheetName: "Activity",
  };

  return (
    <OpsShell
      active="dashboard"
      title="Live Dashboard"
      subtitle={`${EVENT_TITLE} · Kumasi`}
      exportData={{
        columns: ACTIVITY_EXPORT_COLUMNS,
        rows: attendees,
        filename: "ghana-hubs-agm-attendees",
        title: EVENT_TITLE,
        subtitle: "Full attendee register",
        sheetName: "Attendees",
      }}
      actions={
        lastUpdated ? (
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-brand-blue">
            <RefreshCw className="h-3.5 w-3.5 animate-spin [animation-duration:3s]" />
            Updated {formatTime(lastUpdated)}
          </div>
        ) : null
      }
    >
      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          Cannot reach server: {error}
        </div>
      )}

      {!stats ? (
        <div className="flex items-center justify-center py-24 text-slate-500">Loading dashboard…</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Registered"
              value={stats.total}
              hint="Total sign-ups"
              icon={Users}
              tone="blue"
            />
            <MetricCard
              label="Checked in"
              value={stats.checkedIn}
              hint={`${stats.rate}% attendance`}
              icon={UserCheck}
              tone="green"
              highlight
            />
            <MetricCard
              label="Walk-ins"
              value={stats.walkIns}
              hint="Registered on-site"
              icon={UserPlus}
              tone="orange"
            />
            <MetricCard
              label="Pending"
              value={stats.pending}
              hint="Awaiting check-in"
              icon={Clock}
              tone="slate"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 xl:col-span-1">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-navy">Attendance progress</h2>
                <span className="text-sm font-bold text-brand-blue">{stats.rate}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-blue transition-all duration-500"
                  style={{ width: `${stats.rate}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-500">
                <span className="font-semibold text-navy">{stats.checkedIn}</span> of{" "}
                <span className="font-semibold text-navy">{stats.total}</span> attendees checked in
              </p>

              {checkedInList.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {checkedInList.map((a) => (
                    <li key={a._id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate font-medium text-navy">{a.fullName}</span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {formatTime(a.checkedInAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand-blue" />
                  <h2 className="text-sm font-semibold text-navy">Recent activity</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Auto-refreshes every 5s</span>
                  <TableExportMenu {...exportProps} />
                </div>
              </div>

              {recentActivity.length === 0 ? (
                <div className="px-5 py-16 text-center">
                  <p className="text-sm text-slate-500">No activity yet.</p>
                  <a
                    href="#checkin"
                    className="mt-2 inline-block text-sm font-medium text-brand-blue hover:underline"
                  >
                    Open check-in
                  </a>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-slate-100 md:hidden">
                    {paginatedActivity.map((a) => (
                      <li key={a._id} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-navy">{a.fullName}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{a.organisation || "—"}</p>
                          </div>
                          {a.checkedIn ? (
                            <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700 ring-1 ring-green-100">
                              In
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-amber-100">
                              Pending
                            </span>
                          )}
                        </div>
                        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <dt className="text-slate-400">ID</dt>
                            <dd className="font-mono font-semibold text-navy">{a.registrationId}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-400">Category</dt>
                            <dd className="font-medium text-navy">{a.category}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-400">Station</dt>
                            <dd className="font-medium text-navy">
                              {STATION_LABELS[a.checkInStation] || "—"}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-slate-400">Time</dt>
                            <dd className="font-medium text-navy">
                              {a.checkedInAt ? formatTime(a.checkedInAt) : formatTime(a.createdAt)}
                            </dd>
                          </div>
                        </dl>
                      </li>
                    ))}
                  </ul>

                  <TablePagination
                    className="md:hidden"
                    page={activityPage}
                    totalPages={activityTotalPages}
                    totalItems={activityTotalItems}
                    rangeStart={activityRangeStart}
                    rangeEnd={activityRangeEnd}
                    onPageChange={setActivityPage}
                  />

                  <div className="hidden overflow-x-auto md:block">
                    <table className="ops-table min-w-[640px]">
                    <thead>
                      <tr>
                        <th>Attendee</th>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Station</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedActivity.map((a) => (
                        <tr key={a._id} className="text-navy hover:bg-slate-50/80">
                          <td className="px-5 py-3">
                            <p className="font-medium">{a.fullName}</p>
                            <p className="text-xs text-slate-400">{a.organisation || "—"}</p>
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-slate-600">
                            {a.registrationId}
                          </td>
                          <td className="px-5 py-3 text-slate-600">{a.category}</td>
                          <td className="px-5 py-3 text-slate-600">
                            {STATION_LABELS[a.checkInStation] || "—"}
                          </td>
                          <td className="px-5 py-3 text-slate-600">
                            {a.checkedInAt ? (
                              <>
                                {formatTime(a.checkedInAt)}
                                <span className="ml-1 text-xs text-slate-400">
                                  {formatDate(a.checkedInAt)}
                                </span>
                              </>
                            ) : (
                              formatTime(a.createdAt)
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {a.checkedIn ? (
                              <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-100">
                                Checked in
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>

                  <TablePagination
                    className="hidden md:flex"
                    page={activityPage}
                    totalPages={activityTotalPages}
                    totalItems={activityTotalItems}
                    rangeStart={activityRangeStart}
                    rangeEnd={activityRangeEnd}
                    onPageChange={setActivityPage}
                  />
                </>
              )}
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <BarChartPanel title="Check-ins by region" items={stats.byRegion || []} />
            <BarChartPanel title="Check-ins by category" items={stats.byCategory || []} />
            <HourlyChartPanel
              title="Check-ins by hour"
              items={stats.byHour || []}
              peakHour={stats.peakHour}
            />
          </div>
        </div>
      )}
    </OpsShell>
  );
}

const TONE_STYLES = {
  blue: { icon: "bg-blue-50 text-brand-blue ring-blue-100", accent: "text-brand-blue" },
  green: { icon: "bg-green-50 text-green-600 ring-green-100", accent: "text-green-600" },
  orange: { icon: "bg-orange-50 text-orange ring-orange-100", accent: "text-orange" },
  slate: { icon: "bg-slate-100 text-slate-600 ring-slate-200", accent: "text-slate-600" },
};

function MetricCard({ label, value, hint, icon: Icon, tone, highlight }) {
  const styles = TONE_STYLES[tone];

  return (
    <div
      className={`rounded-2xl bg-white p-5 ring-1 transition-shadow hover:shadow-md ${
        highlight ? "ring-brand-blue/30 shadow-sm shadow-brand-blue/5" : "ring-slate-200/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {highlight && (
          <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-blue">
            Live
          </span>
        )}
      </div>
      <p className="mt-3 sm:mt-4 font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm font-medium text-navy">{label}</p>
      <p className={`mt-0.5 text-xs ${styles.accent}`}>{hint}</p>
    </div>
  );
}
