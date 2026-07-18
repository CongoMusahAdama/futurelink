import { useEffect, useState } from "react";
import OpsShell from "../components/OpsShell";
import TableExportMenu from "../components/TableExportMenu";
import { withDemoFallback } from "../data/dummyAttendees";
import { api } from "../lib/api";
import { ATTENDEE_EXPORT_COLUMNS } from "../lib/exportTable";

const EVENT_TITLE = "Ghana Hubs Network AGM 2026";

export default function AdminPage() {
  const [attendees, setAttendees] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .listAttendees()
      .then((list) => {
        const { data, isDemo: demo } = withDemoFallback(list);
        setAttendees(data);
        setIsDemo(demo);
      })
      .catch((err) => {
        const { data, isDemo: demo } = withDemoFallback([]);
        setAttendees(data);
        setIsDemo(demo);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = attendees.filter((a) => {
    if (filter === "checked-in") return a.checkedIn;
    if (filter === "pending") return !a.checkedIn;
    return true;
  });

  const checkedInCount = attendees.filter((a) => a.checkedIn).length;

  const exportProps = {
    columns: ATTENDEE_EXPORT_COLUMNS,
    rows: filtered,
    filename: "ghana-hubs-agm-attendees",
    title: EVENT_TITLE,
    subtitle: `Attendee list · ${filter === "all" ? "All" : filter === "checked-in" ? "Checked in" : "Pending"}`,
    sheetName: "Attendees",
  };

  return (
    <OpsShell
      active="admin"
      title="Attendees"
      subtitle={`${attendees.length} registered · ${checkedInCount} checked in`}
      exportData={{
        columns: ATTENDEE_EXPORT_COLUMNS,
        rows: attendees,
        filename: "ghana-hubs-agm-attendees",
        title: EVENT_TITLE,
        subtitle: "Full attendee register",
        sheetName: "Attendees",
      }}
    >
      {isDemo && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Showing <strong>sample data</strong> for preview — this will be replaced by live registrations.
        </div>
      )}

      {error && !isDemo && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
          {[
            { id: "all", label: `All (${attendees.length})` },
            { id: "checked-in", label: "Checked in" },
            { id: "pending", label: "Pending" },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === id
                  ? "bg-brand-blue text-navy"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Loading attendees…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-slate-200/80">
          <p className="text-slate-500">No attendees yet.</p>
          <a href="#checkin" className="mt-3 inline-block text-sm font-medium text-brand-blue">
            Go to check-in
          </a>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <p className="text-sm font-semibold text-navy">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </p>
            <TableExportMenu {...exportProps} />
          </div>
          <div className="overflow-x-auto">
            <table className="ops-table min-w-[720px]">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Organisation</th>
                  <th>Hub / Region</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id} className="text-navy hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{a.registrationId}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium">{a.fullName}</p>
                      {a.phone && <p className="text-xs text-slate-400">{a.phone}</p>}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{a.organisation || "—"}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {[a.hub, a.region].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{a.category}</td>
                    <td className="px-5 py-3">
                      {a.checkedIn ? (
                        <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-100">
                          Checked in
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </OpsShell>
  );
}
