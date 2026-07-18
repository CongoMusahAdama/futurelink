import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { getTicketFields } from "./eventTicketMeta";

const NAVY = [0, 29, 74];
const BLUE = [30, 90, 138];
const MINT = [26, 251, 151];
const SLATE = [100, 116, 139];

export async function downloadTicketPdf(attendee) {
  const t = getTicketFields(attendee);
  const qrDataUrl = await QRCode.toDataURL(t.registrationId, {
    width: 280,
    margin: 1,
    color: { dark: "#001d4a", light: "#ffffff" },
  });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 168] });
  const w = 100;

  // Header
  doc.setFillColor(...NAVY);
  doc.roundedRect(8, 8, w - 16, 42, 3, 3, "F");
  doc.setFillColor(...BLUE);
  doc.rect(8, 8, w - 16, 14, "F");
  doc.roundedRect(8, 8, w - 16, 42, 3, 3, "F");

  // Badge
  doc.setFillColor(...MINT);
  doc.roundedRect(14, 14, 22, 6, 1.5, 1.5, "F");
  doc.setTextColor(...NAVY);
  doc.setFontSize(6);
  doc.setFont(undefined, "bold");
  doc.text(t.badge, 25, 18.2, { align: "center" });

  // Title block
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text(t.title, w / 2, 28, { align: "center", maxWidth: w - 24 });
  doc.setFontSize(7);
  doc.setFont(undefined, "normal");
  doc.text(t.subtitle, w / 2, 34, { align: "center" });
  doc.setFontSize(6);
  doc.text(t.location, w / 2, 39, { align: "center" });

  // Body card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(8, 52, w - 16, 108, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(8, 52, w - 16, 108, 3, 3, "S");

  // Notch circles (page bg)
  doc.setFillColor(255, 255, 255);
  doc.circle(8, 52, 4, "F");
  doc.circle(w - 8, 52, 4, "F");

  let y = 60;
  doc.setTextColor(...SLATE);
  doc.setFontSize(6);
  doc.text("Date", 16, y);
  doc.text("Time", 58, y);
  doc.setTextColor(...NAVY);
  doc.setFontSize(8);
  doc.setFont(undefined, "bold");
  doc.text(t.date, 16, y + 5);
  doc.text(t.time, 58, y + 5);

  y += 14;
  doc.setFont(undefined, "normal");
  doc.setTextColor(...SLATE);
  doc.setFontSize(5.5);
  doc.text("Hall", 16, y);
  doc.text("Region", 42, y);
  doc.text("Category", 68, y);
  doc.setTextColor(...NAVY);
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text(t.hall, 16, y + 5);
  doc.text(t.region, 42, y + 5);
  doc.text(t.category, 68, y + 5);

  y += 16;
  doc.setFont(undefined, "normal");
  doc.setTextColor(...SLATE);
  doc.setFontSize(6);
  doc.text("Attendee", 16, y);
  doc.setTextColor(...NAVY);
  doc.setFontSize(10);
  doc.setFont(undefined, "bold");
  doc.text(t.fullName, 16, y + 5, { maxWidth: w - 32 });
  if (t.organisation) {
    doc.setFontSize(7);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...SLATE);
    doc.text(t.organisation, 16, y + 11, { maxWidth: w - 32 });
    y += 4;
  }

  y += 18;
  doc.addImage(qrDataUrl, "PNG", 34, y, 32, 32);
  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text(t.registrationId, w / 2, y + 38, { align: "center" });
  doc.setFontSize(6);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...SLATE);
  doc.text("Scan at Fast Lane for check-in", w / 2, y + 43, { align: "center" });

  doc.setFontSize(5.5);
  doc.text(`Powered by ${t.brandName}`, w / 2, 162, { align: "center" });

  doc.save(`ticket-${t.registrationId}.pdf`);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function printTicket(attendee) {
  const t = getTicketFields(attendee);
  const win = window.open("", "_blank", "width=420,height=720");
  if (!win) return;

  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Ticket ${escapeHtml(t.registrationId)}</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Onest:wght@500;700&family=Syne:wght@600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Onest', sans-serif; background: #eef4fb; display: flex; justify-content: center; padding: 20px; }
  .wrap { width: 400px; border-radius: 26px; overflow: hidden; background: linear-gradient(#001d4a 0%, #001d4a 32%, #eef4fb 32%); box-shadow: 0 16px 40px rgba(0,29,74,0.16); }
  .band { display: flex; justify-content: space-between; align-items: center; min-height: 88px; padding: 20px 20px 40px; color: #fff; }
  .band-k { font-size: 13px; opacity: 0.85; }
  .band-t { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.02em; margin-top: 6px; }
  .band-logo { height: 48px; max-width: 72px; background: #fff; border-radius: 10px; padding: 6px 8px; }
  .pass { display: flex; gap: 16px; min-height: 184px; margin: -22px 16px 0; padding: 18px 20px; background: #fff; border-radius: 20px; box-shadow: 0 10px 28px rgba(0,29,74,0.12); }
  .qr-col { flex-shrink: 0; background: #f8fafc; border-radius: 10px; padding: 4px; }
  .details { flex: 1; min-width: 0; }
  .route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .code { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 22px; color: #001d4a; letter-spacing: 0.04em; display: block; text-align: center; }
  .hub-sub { font-size: 10px; color: #94a3b8; text-transform: uppercase; text-align: center; display: block; }
  .arrow { color: #1afb97; font-size: 14px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 10px; margin-bottom: 6px; }
  label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; display: block; }
  .val { font-size: 12px; font-weight: 700; color: #001d4a; }
  .name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: 0.01em; }
  .id-row { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px dashed #e2e8f0; padding-top: 6px; margin-top: 4px; }
  .id { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 18px; color: #001d4a; letter-spacing: 0.04em; }
  .region { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
  .foot { text-align: center; padding: 10px; }
  .brand { height: 20px; }
  @media print { body { background: #fff; padding: 0; } .wrap { box-shadow: none; } }
</style></head><body>
  <div class="wrap">
    <div class="band">
      <div><p class="band-k">Ghana Hubs Network · AGM 2026</p><p class="band-t">You're checked in</p></div>
      <img class="band-logo" src="${escapeHtml(t.eventLogo)}" alt="" />
    </div>
    <div class="pass">
      <div class="qr-col" id="qr"></div>
      <div class="details">
        <div class="route">
          <div><span class="code">GHN</span><span class="hub-sub">${escapeHtml(t.city)}</span></div>
          <span class="arrow">→</span>
          <div><span class="code">AGM</span><span class="hub-sub">2026</span></div>
        </div>
        <div class="meta">
          <div><label>Date</label><div class="val">${escapeHtml(t.shortDate)}</div></div>
          <div><label>Time</label><div class="val">${escapeHtml(t.time)}</div></div>
          <div><label>Attendee</label><div class="val name">${escapeHtml(t.fullName)}</div></div>
          <div><label>Category</label><div class="val">${escapeHtml(t.category)}</div></div>
        </div>
        <div class="id-row"><span class="id">${escapeHtml(t.registrationId)}</span><span class="region">${escapeHtml(t.region)}</span></div>
      </div>
    </div>
    <div class="foot"><img class="brand" src="${escapeHtml(t.brandLogo)}" alt="${escapeHtml(t.brandName)}" /></div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js"><\/script>
  <script>
    QRCode.toCanvas(document.createElement('canvas'), "${escapeHtml(t.registrationId)}", {
      width: 120, margin: 1, color: { dark: '#001d4a', light: '#ffffff' }
    }, function(err, canvas) {
      if (!err) document.getElementById('qr').appendChild(canvas);
      setTimeout(function() { window.print(); window.close(); }, 500);
    });
  <\/script>
</body></html>`);
  win.document.close();
}
