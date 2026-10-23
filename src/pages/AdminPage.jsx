import { useEffect, useState, useCallback, useRef } from "react";
import { Copy, Check, ThumbsUp, ThumbsDown, Trash2, ExternalLink, Plus, ImageIcon, CalendarPlus, X, Printer } from "lucide-react";
import OpsShell from "../components/OpsShell";
import TableExportMenu from "../components/TableExportMenu";
import TablePagination from "../components/TablePagination";
import { api } from "../lib/api";
import { ATTENDEE_EXPORT_COLUMNS } from "../lib/exportTable";
import { usePagination } from "../hooks/usePagination";
import { getRegistrations, updateRegistrationStatus, deleteRegistration } from "../lib/registrations";
import { saveEvent, getDynamicEvents, deleteDynamicEvent, setEventStatus } from "../lib/eventStore";
import CategorySelect from "../components/CategorySelect";
import { EVENT } from "../data/checkin";
import { printTicket } from "../lib/ticketPdf";
import { runWithFeedback } from "../lib/alerts";

const EVENT_TITLE = EVENT.title;
const PAGE_SIZE = 10;

// ─── Copy link helper ───────────────────────────────────────────────────────

function CopyLinkButton({ eventId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `${window.location.origin}${window.location.pathname}#checkout/${eventId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy checkout link"
      className="admin-reg-copy-btn"
    >
      {copied ? (
        <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!</>
      ) : (
        <><Copy className="h-3.5 w-3.5" /> Copy Link</>
      )}
    </button>
  );
}

// ─── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    pending:  "admin-reg-badge--pending",
    approved: "admin-reg-badge--approved",
    rejected: "admin-reg-badge--rejected",
  };
  const label = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
  return (
    <span className={`admin-reg-badge ${map[status] ?? "admin-reg-badge--pending"}`}>
      {label[status] ?? status}
    </span>
  );
}

// ─── Registrations Tab ──────────────────────────────────────────────────────

function RegistrationsTab() {
  const [regs, setRegs] = useState([]);
  const [filter, setFilter] = useState("all");

  const reload = useCallback(() => setRegs(getRegistrations()), []);

  useEffect(() => {
    reload();
    // Refresh when another tab saves
    const onStorage = (e) => { if (e.key === "ee-registrations") reload(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [reload]);

  const filtered = regs.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const {
    page, setPage, totalPages, totalItems,
    paginatedItems, rangeStart, rangeEnd, resetPage,
  } = usePagination(filtered, PAGE_SIZE);

  useEffect(() => { resetPage(); }, [filter, resetPage]);

  const handleApprove = (id) => {
    updateRegistrationStatus(id, "approved");
    reload();
  };

  const handleReject = (id) => {
    updateRegistrationStatus(id, "rejected");
    reload();
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this registration?")) {
      deleteRegistration(id);
      reload();
    }
  };

  const pendingCount = regs.filter((r) => r.status === "pending").length;
  const approvedCount = regs.filter((r) => r.status === "approved").length;

  return (
    <div>
      {/* Stats row */}
      <div className="admin-reg-stats">
        <div className="admin-reg-stat">
          <span className="admin-reg-stat-num">{regs.length}</span>
          <span className="admin-reg-stat-label">Total</span>
        </div>
        <div className="admin-reg-stat">
          <span className="admin-reg-stat-num admin-reg-stat-num--pending">{pendingCount}</span>
          <span className="admin-reg-stat-label">Pending</span>
        </div>
        <div className="admin-reg-stat">
          <span className="admin-reg-stat-num admin-reg-stat-num--approved">{approvedCount}</span>
          <span className="admin-reg-stat-label">Approved</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { id: "all", label: `All (${regs.length})` },
          { id: "pending", label: `Pending (${pendingCount})` },
          { id: "approved", label: `Approved (${approvedCount})` },
          { id: "rejected", label: "Rejected" },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              filter === id
                ? "bg-brand-blue text-navy"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center ring-1 ring-slate-200/80">
          <p className="text-slate-500">No registrations found.</p>
          {filter === "all" && (
            <p className="mt-2 text-sm text-slate-400">
              Share a checkout link so attendees can register.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {paginatedItems.map((r) => (
              <li key={r.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/80">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy">{r.firstName} {r.lastName}</p>
                    <p className="text-xs text-slate-500">{r.email}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div><dt className="text-slate-400">Event</dt><dd className="font-medium text-navy">{r.eventTitle}</dd></div>
                  <div><dt className="text-slate-400">Company</dt><dd className="font-medium text-navy">{r.company || "—"}</dd></div>
                  <div><dt className="text-slate-400">Phone</dt><dd className="font-medium text-navy">{r.phone || "—"}</dd></div>
                  <div><dt className="text-slate-400">Submitted</dt><dd className="font-medium text-navy">{new Date(r.submittedAt).toLocaleDateString()}</dd></div>
                </dl>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.status === "pending" && (
                    <>
                      <button type="button" onClick={() => handleApprove(r.id)} className="admin-reg-action-btn admin-reg-action-btn--approve"><ThumbsUp className="h-3.5 w-3.5" /> Approve</button>
                      <button type="button" onClick={() => handleReject(r.id)} className="admin-reg-action-btn admin-reg-action-btn--reject"><ThumbsDown className="h-3.5 w-3.5" /> Reject</button>
                    </>
                  )}
                  {r.status === "approved" && <CopyLinkButton eventId={r.eventId} />}
                  <button type="button" onClick={() => handleDelete(r.id)} className="admin-reg-action-btn admin-reg-action-btn--delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
          <TablePagination className="mt-4 rounded-2xl ring-1 ring-slate-200/80 md:hidden" page={page} totalPages={totalPages} totalItems={totalItems} rangeStart={rangeStart} rangeEnd={rangeEnd} onPageChange={setPage} />

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 md:block">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <p className="text-sm font-semibold text-navy">{totalItems} record{totalItems !== 1 ? "s" : ""}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="ops-table min-w-[860px]">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Event</th>
                    <th>Company</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((r) => (
                    <tr key={r.id} className="text-navy hover:bg-slate-50/80">
                      <td className="px-5 py-3">
                        <p className="font-medium">{r.firstName} {r.lastName}</p>
                        {r.phone && <p className="text-xs text-slate-400">{r.phone}</p>}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{r.email}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{r.eventTitle}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{r.company || "—"}</td>
                      <td className="px-5 py-3 text-xs text-slate-500">
                        {new Date(r.submittedAt).toLocaleDateString()}<br/>
                        <span className="text-slate-400">{new Date(r.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {r.status === "pending" && (
                            <>
                              <button type="button" onClick={() => handleApprove(r.id)} title="Approve" className="admin-reg-icon-btn admin-reg-icon-btn--approve"><ThumbsUp className="h-4 w-4" /></button>
                              <button type="button" onClick={() => handleReject(r.id)} title="Reject" className="admin-reg-icon-btn admin-reg-icon-btn--reject"><ThumbsDown className="h-4 w-4" /></button>
                            </>
                          )}
                          {r.status === "approved" && (
                            <>
                              <CopyLinkButton eventId={r.eventId} />
                              <a href={`#checkout/${r.eventId}`} target="_blank" rel="noopener noreferrer" title="Open checkout" className="admin-reg-icon-btn"><ExternalLink className="h-4 w-4" /></a>
                            </>
                          )}
                          <button type="button" onClick={() => handleDelete(r.id)} title="Delete" className="admin-reg-icon-btn admin-reg-icon-btn--delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination page={page} totalPages={totalPages} totalItems={totalItems} rangeStart={rangeStart} rangeEnd={rangeEnd} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Attendees Tab (existing) ────────────────────────────────────────────────

function AttendeesTab({ onLoaded }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .listAttendees()
      .then((list) => {
        const rows = Array.isArray(list) ? list : [];
        setAttendees(rows);
        onLoaded?.(rows);
        setError("");
      })
      .catch((err) => {
        setAttendees([]);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [onLoaded]);

  const filtered = attendees.filter((a) => {
    if (filter === "checked-in") return a.checkedIn;
    if (filter === "pending") return !a.checkedIn;
    return true;
  });

  const {
    page, setPage, totalPages, totalItems,
    paginatedItems, rangeStart, rangeEnd, resetPage,
  } = usePagination(filtered, PAGE_SIZE);

  useEffect(() => { resetPage(); }, [filter, resetPage]);

  const checkedInCount = attendees.filter((a) => a.checkedIn).length;

  const exportProps = {
    columns: ATTENDEE_EXPORT_COLUMNS,
    rows: filtered,
    filename: `${EVENT.fileSlug}-attendees`,
    title: EVENT_TITLE,
    subtitle: `Attendee list · ${filter === "all" ? "All" : filter === "checked-in" ? "Checked in" : "Pending"}`,
    sheetName: "Attendees",
  };

  return (
    <>
      {error && (
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
            className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
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
        <>
          <ul className="space-y-3 md:hidden">
            {paginatedItems.map((a) => (
              <li key={a._id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/80">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">{a.fullName}</p>
                    <p className="mt-0.5 font-mono text-xs text-slate-500">{a.registrationId}</p>
                  </div>
                  {a.checkedIn ? (
                    <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700 ring-1 ring-green-100">In</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">Pending</span>
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div className="col-span-2"><dt className="text-slate-400">Organisation</dt><dd className="font-medium text-navy">{a.organisation || "—"}</dd></div>
                  <div><dt className="text-slate-400">Area / Region</dt><dd className="font-medium text-navy">{[a.hub, a.region].filter(Boolean).join(" · ") || "—"}</dd></div>
                  <div><dt className="text-slate-400">Category</dt><dd className="font-medium text-navy">{a.category}</dd></div>
                  {a.phone && <div className="col-span-2"><dt className="text-slate-400">Phone</dt><dd className="font-medium text-navy">{a.phone}</dd></div>}
                </dl>
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => runWithFeedback(() => printTicket(a), null, "Could not print badge")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy hover:bg-slate-200 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5 text-brand-blue" />
                    Print badge (80×80)
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <TablePagination className="mt-4 rounded-2xl ring-1 ring-slate-200/80 md:hidden" page={page} totalPages={totalPages} totalItems={totalItems} rangeStart={rangeStart} rangeEnd={rangeEnd} onPageChange={setPage} />

          <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 md:block">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <p className="text-sm font-semibold text-navy">{totalItems} record{totalItems !== 1 ? "s" : ""}</p>
              <TableExportMenu {...exportProps} />
            </div>
            <div className="overflow-x-auto">
              <table className="ops-table min-w-[760px]">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Organisation</th><th>Area / Region</th><th>Category</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((a) => (
                    <tr key={a._id} className="text-navy hover:bg-slate-50/80">
                      <td className="px-5 py-3 font-mono text-xs text-slate-600">{a.registrationId}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium">{a.fullName}</p>
                        {a.phone && <p className="text-xs text-slate-400">{a.phone}</p>}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{a.organisation || "—"}</td>
                      <td className="px-5 py-3 text-slate-600">{[a.hub, a.region].filter(Boolean).join(" · ") || "—"}</td>
                      <td className="px-5 py-3 text-slate-600">{a.category}</td>
                      <td className="px-5 py-3">
                        {a.checkedIn ? (
                          <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-100">Checked in</span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">Pending</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => runWithFeedback(() => printTicket(a), null, "Could not print badge")}
                          title="Print 80×80 check-in badge"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-navy hover:bg-slate-200 transition-colors"
                        >
                          <Printer className="h-3.5 w-3.5 text-brand-blue" />
                          Print (80×80)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination page={page} totalPages={totalPages} totalItems={totalItems} rangeStart={rangeStart} rangeEnd={rangeEnd} onPageChange={setPage} />
          </div>

          <div className="mt-4 flex justify-end md:hidden">
            <TableExportMenu {...exportProps} />
          </div>
        </>
      )}
    </>
  );
}

// ── Add Event Tab ────────────────────────────────────────────────────────────────────────────────

const blankForm = {
  title: "",
  category: "Conference",
  date: "",
  startsAt: "",
  location: "",
  excerpt: "",
  registrationUrl: "",
  image: null,   // base64 data-URL
  imagePreview: null,
  imageFileName: "",
};

function AddEventField({ id, label, required = true, children }) {
  return (
    <div className="add-event-field">
      <label htmlFor={id} className="add-event-label">
        {label}{required && <span className="add-event-required">*</span>}
      </label>
      {children}
    </div>
  );
}

function AddEventTab() {
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [dynamicEvents, setDynamicEvents] = useState(() => getDynamicEvents());
  const fileRef = useRef(null);

  const reload = useCallback(() => setDynamicEvents(getDynamicEvents()), []);

  const handleImageChange = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((p) => ({
        ...p,
        image: ev.target.result,
        imagePreview: ev.target.result,
        imageFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) handleImageChange(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Event title is required."); return; }
    if (!form.category.trim()) { setError("Please choose or enter a category."); return; }
    if (!form.date.trim()) { setError("Date is required."); return; }
    if (!form.location.trim()) { setError("Location is required."); return; }
    if (!form.registrationUrl.trim()) { setError("Attendee registration link is required."); return; }
    setSaving(true);
    try {
      saveEvent({
        title: form.title.trim(),
        category: form.category,
        date: form.date.trim(),
        startsAt: form.startsAt || null,
        location: form.location.trim(),
        excerpt: form.excerpt.trim(),
        registrationUrl: form.registrationUrl.trim(),
        image: form.image,
        status: "approved",
      });
      setSaved(true);
      setForm(blankForm);
      reload();
      window.dispatchEvent(new Event("ee-events-updated"));
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this event?")) return;
    deleteDynamicEvent(id);
    reload();
    window.dispatchEvent(new Event("ee-events-updated"));
  };

  const handleApprove = (id) => {
    setEventStatus(id, "approved");
    reload();
    window.dispatchEvent(new Event("ee-events-updated"));
  };

  const pending = dynamicEvents.filter((e) => e.status === "pending");
  const approved = dynamicEvents.filter((e) => e.status !== "pending");

  return (
    <div>
      {/* Success banner */}
      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <Check className="h-4 w-4" />
          Event published! It now appears on the landing page and events list.
        </div>
      )}

      {/* Form card */}
      <div className="add-event-card">
        <div className="add-event-card-header">
          <CalendarPlus className="h-5 w-5 text-brand-blue" />
          <h2 className="add-event-card-title">Add New Event</h2>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="add-event-form">
          {/* Image upload */}
          <div className="add-event-field add-event-field-full">
            <label className="add-event-label">Event Image <span className="text-slate-400 font-normal">(optional, max 5 MB)</span></label>
            <div
              className={`add-event-dropzone ${form.imagePreview ? "add-event-dropzone--filled" : ""}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            >
              {form.imagePreview ? (
                <>
                  <img src={form.imagePreview} alt="Preview" className="add-event-preview-img" />
                  <div className="add-event-preview-overlay">
                    <span className="add-event-preview-change">Click to change image</span>
                  </div>
                  <button
                    type="button"
                    className="add-event-preview-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm((p) => ({ ...p, image: null, imagePreview: null, imageFileName: "" }));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="add-event-dropzone-inner">
                  <ImageIcon className="h-8 w-8 text-slate-300" />
                  <p className="add-event-dropzone-text">
                    <span className="font-semibold text-brand-blue">Click to upload</span> or drag &amp; drop
                  </p>
                  <p className="add-event-dropzone-hint">PNG, JPG, WEBP · max 5 MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
            />
          </div>

          {/* Text fields */}
          <AddEventField id="ae-title" label="Event Title">
            <input id="ae-title" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. National Tech Summit 2026" className="add-event-input" />
          </AddEventField>

          <AddEventField id="ae-category" label="Category">
            <CategorySelect
              id="ae-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="add-event-input"
            />
          </AddEventField>

          <AddEventField id="ae-date" label="Display Date">
            <input id="ae-date" name="date" required value={form.date} onChange={handleChange} placeholder="e.g. Sat, 15 Aug 2026" className="add-event-input" />
          </AddEventField>

          <AddEventField id="ae-startsAt" label="Start Date & Time" required={false}>
            <input id="ae-startsAt" name="startsAt" type="datetime-local" value={form.startsAt} onChange={handleChange} className="add-event-input" />
          </AddEventField>

          <AddEventField id="ae-location" label="Location">
            <input id="ae-location" name="location" required value={form.location} onChange={handleChange} placeholder="e.g. Accra, Ghana" className="add-event-input" />
          </AddEventField>

          <div className="add-event-field add-event-field-full">
            <label htmlFor="ae-reg-url" className="add-event-label">
              Attendee Registration Link<span className="add-event-required">*</span>
            </label>
            <input
              id="ae-reg-url"
              name="registrationUrl"
              type="url"
              required
              value={form.registrationUrl}
              onChange={handleChange}
              placeholder="https://… (organizer&apos;s registration form)"
              className="add-event-input"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Attendees on the Events page will open this link to register.
            </p>
          </div>

          <div className="add-event-field add-event-field-full">
            <label htmlFor="ae-excerpt" className="add-event-label">Description <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea id="ae-excerpt" name="excerpt" rows={3} value={form.excerpt} onChange={handleChange} placeholder="Brief description of the event…" className="add-event-input add-event-textarea" />
          </div>

          <div className="add-event-field-full add-event-actions">
            <button type="submit" disabled={saving} className="add-event-submit">
              <Plus className="h-4 w-4" />
              {saving ? "Publishing…" : "Publish Event"}
            </button>
          </div>
        </form>
      </div>

      {/* Pending organizer submissions */}
      {pending.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold text-navy">
            Pending approval ({pending.length})
          </h3>
          <ul className="space-y-3">
            {pending.map((ev) => (
              <li key={ev.id} className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                {ev.image && (
                  <img src={ev.image} alt={ev.title} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy">{ev.title}</p>
                  <p className="text-xs text-slate-500">
                    {ev.category} · {ev.date} · {ev.location}
                    {ev.organizerName ? ` · ${ev.organizerName}` : ""}
                  </p>
                  <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    Pending
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(ev.id)}
                    className="admin-reg-icon-btn"
                    title="Approve & publish"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ev.id)}
                    className="admin-reg-icon-btn admin-reg-icon-btn--delete"
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Approved / live events */}
      {approved.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-semibold text-navy">Live events ({approved.length})</h3>
          <ul className="space-y-3">
            {approved.map((ev) => (
              <li key={ev.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                {ev.image && (
                  <img src={ev.image} alt={ev.title} className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-navy">{ev.title}</p>
                  <p className="text-xs text-slate-500">{ev.category} · {ev.date} · {ev.location}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={ev.registrationUrl || `#events`}
                    target={ev.registrationUrl ? "_blank" : undefined}
                    rel={ev.registrationUrl ? "noopener noreferrer" : undefined}
                    className="admin-reg-icon-btn"
                    title={ev.registrationUrl ? "Open registration link" : "No registration link"}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(ev.id)}
                    className="admin-reg-icon-btn admin-reg-icon-btn--delete"
                    title="Delete event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main AdminPage ────────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("registrations");
  // Loaded by the Attendees tab, so the top-bar export downloads every attendee.
  const [allAttendees, setAllAttendees] = useState([]);

  const pendingCount = getRegistrations().filter((r) => r.status === "pending").length;

  const attendeeSubtitle = (() => {
    const all = getRegistrations();
    return `${all.length} submitted · ${all.filter((r) => r.status === "approved").length} approved`;
  })();

  return (
    <OpsShell
      active="admin"
      title={
        activeTab === "registrations" ? "Event Registrations"
        : activeTab === "add-event" ? "Add Event"
        : "Attendees"
      }
      subtitle={activeTab === "registrations" ? attendeeSubtitle : undefined}
      exportData={activeTab === "attendees" ? {
        columns: ATTENDEE_EXPORT_COLUMNS,
        rows: allAttendees,
        filename: `${EVENT.fileSlug}-attendees`,
        title: EVENT_TITLE,
        subtitle: "Full attendee register",
        sheetName: "Attendees",
      } : undefined}
    >
      {/* Tab switcher */}
      <div className="mb-6 flex gap-1 rounded-2xl bg-slate-200/70 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("registrations")}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            activeTab === "registrations"
              ? "bg-white text-navy shadow-sm"
              : "text-slate-500 hover:text-navy"
          }`}
        >
          Registrations
          {pendingCount > 0 && (
            <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange px-1.5 text-[10px] font-bold text-navy">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("add-event")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            activeTab === "add-event"
              ? "bg-white text-navy shadow-sm"
              : "text-slate-500 hover:text-navy"
          }`}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Event
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("attendees")}
          className={`flex flex-1 items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-all ${
            activeTab === "attendees"
              ? "bg-white text-navy shadow-sm"
              : "text-slate-500 hover:text-navy"
          }`}
        >
          Check-In Attendees
        </button>
      </div>


      {activeTab === "registrations" && <RegistrationsTab />}
      {activeTab === "add-event" && <AddEventTab />}
      {activeTab === "attendees" && <AttendeesTab onLoaded={setAllAttendees} />}
    </OpsShell>

  );
}
