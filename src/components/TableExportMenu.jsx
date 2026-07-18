import { useEffect, useRef, useState } from "react";
import { ChevronDown, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { runExport } from "../lib/exportTable";

const FORMATS = [
  { id: "csv", label: "CSV", icon: Sheet, hint: ".csv" },
  { id: "excel", label: "Excel", icon: FileSpreadsheet, hint: ".xlsx" },
  { id: "pdf", label: "PDF", icon: FileText, hint: ".pdf" },
];

export default function TableExportMenu({
  columns,
  rows,
  filename,
  title = "Export",
  subtitle,
  sheetName,
  variant = "light",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const disabled = !rows?.length;

  function handleExport(format) {
    runExport(format, { columns, rows, filename, title, subtitle, sheetName });
    setOpen(false);
  }

  const isDark = variant === "dark";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          isDark
            ? "bg-white/10 text-white hover:bg-white/15"
            : "bg-white text-navy ring-1 ring-slate-200 hover:bg-slate-50"
        }`}
      >
        <Sheet className="h-4 w-4 text-brand-blue" />
        Export
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl shadow-lg ring-1 ${
            isDark ? "bg-navy-light ring-white/10" : "bg-white ring-slate-200"
          }`}
        >
          <div className={`border-b px-3 py-2 text-xs font-medium ${isDark ? "border-white/10 text-blue-200/70" : "border-slate-100 text-slate-500"}`}>
            Download as
          </div>
          {FORMATS.map(({ id, label, icon: Icon, hint }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleExport(id)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                isDark
                  ? "text-blue-100 hover:bg-white/10"
                  : "text-navy hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isDark ? "text-brand-blue" : "text-brand-blue"}`} />
              <span className="flex-1 font-medium">{label}</span>
              <span className={`text-xs ${isDark ? "text-blue-200/50" : "text-slate-400"}`}>{hint}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
