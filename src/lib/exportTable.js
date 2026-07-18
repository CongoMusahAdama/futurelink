import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function exportToCsv({ columns, rows, filename }) {
  const headerLine = columns.map((c) => escapeCsvCell(c.header)).join(",");
  const bodyLines = rows.map((row) =>
    columns.map((c) => escapeCsvCell(c.accessor(row))).join(",")
  );
  const csv = [headerLine, ...bodyLines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${filename}.csv`);
}

export function exportToExcel({ columns, rows, filename, sheetName = "Sheet1" }) {
  const header = columns.map((c) => c.header);
  const data = rows.map((row) => columns.map((c) => c.accessor(row)));
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPdf({ columns, rows, filename, title, subtitle }) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.setTextColor(10, 37, 64);
  doc.text(title, 40, 40);

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 40, 58);
  }

  autoTable(doc, {
    startY: subtitle ? 72 : 56,
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => c.accessor(row))),
    styles: { fontSize: 8, cellPadding: 6 },
    headStyles: { fillColor: [0, 29, 74], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 40, right: 40 },
    tableWidth: pageWidth - 80,
  });

  doc.save(`${filename}.pdf`);
}

/** Attendee list columns for admin / full export */
export const ATTENDEE_EXPORT_COLUMNS = [
  { header: "ID", accessor: (r) => r.registrationId },
  { header: "Name", accessor: (r) => r.fullName },
  { header: "Phone", accessor: (r) => r.phone || "" },
  { header: "Organisation", accessor: (r) => r.organisation || "" },
  { header: "Hub", accessor: (r) => r.hub || "" },
  { header: "Region", accessor: (r) => r.region || "" },
  { header: "Category", accessor: (r) => r.category },
  {
    header: "Status",
    accessor: (r) => (r.checkedIn ? "Checked in" : "Pending"),
  },
  {
    header: "Station",
    accessor: (r) => r.checkInStation || "",
  },
];

const STATION_LABELS = {
  "help-desk": "Help Desk",
  "fast-lane": "Fast Lane",
  vip: "VIP Desk",
};

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Activity table columns for dashboard export */
export const ACTIVITY_EXPORT_COLUMNS = [
  { header: "Attendee", accessor: (r) => r.fullName },
  { header: "Organisation", accessor: (r) => r.organisation || "" },
  { header: "ID", accessor: (r) => r.registrationId },
  { header: "Category", accessor: (r) => r.category },
  {
    header: "Station",
    accessor: (r) => STATION_LABELS[r.checkInStation] || "",
  },
  {
    header: "Time",
    accessor: (r) => formatTime(r.checkedInAt || r.createdAt),
  },
  {
    header: "Status",
    accessor: (r) => (r.checkedIn ? "Checked in" : "Pending"),
  },
];

export function runExport(format, options) {
  if (format === "csv") exportToCsv(options);
  else if (format === "excel") exportToExcel(options);
  else if (format === "pdf") exportToPdf(options);
}
