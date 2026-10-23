import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { getTicketFields } from "./eventTicketMeta";
import { EVENT } from "../data/checkin";
import {
  ACCENT,
  ACCENT_HEX,
  ACCENT_INK_HEX,
  BG,
  BG_HEX,
  INK,
  INK_HEX,
  loadCoverCrop,
  loadImageDataUrl,
} from "./eventTheme";

const SLATE = [100, 116, 139];
const MUTED = [148, 163, 184];

function qrDataUrl(text, width) {
  return QRCode.toDataURL(text, {
    width,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}

function checkedInLabel(attendee) {
  if (!attendee?.checkedInAt) return EVENT.title;
  const time = new Date(attendee.checkedInAt).toLocaleTimeString("en-GH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `Checked in at ${time}`;
}

/** Draw an image inside a box, keeping its aspect ratio; returns the drawn width */
function addImageFit(doc, dataUrl, x, y, maxW, maxH) {
  const { width, height } = doc.getImageProperties(dataUrl);
  const scale = Math.min(maxW / width, maxH / height);
  const w = width * scale;
  const h = height * scale;
  doc.addImage(dataUrl, x, y + (maxH - h) / 2, w, h);
  return w;
}

export async function downloadTicketPdf(attendee) {
  const t = getTicketFields(attendee);
  const W = 100;
  const H = 172;
  const flyerH = 40;

  const [qr, flyer, orgLogo, partnerLogo] = await Promise.all([
    qrDataUrl(t.registrationId, 360),
    loadCoverCrop(EVENT.flyer, W / flyerH, 0.235),
    loadImageDataUrl(EVENT.organizerLogo),
    loadImageDataUrl(EVENT.partnerLogo),
  ]);

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [W, H] });

  // Page background
  doc.setFillColor(...BG);
  doc.rect(0, 0, W, H, "F");

  // Flyer header + ink band
  let y = 0;
  if (flyer) {
    doc.addImage(flyer, "JPEG", 0, 0, W, flyerH);
    y = flyerH;
  }
  doc.setFillColor(...INK);
  doc.rect(0, y, W, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(checkedInLabel(attendee), 10, y + 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("YOU'RE CHECKED IN", 10, y + 19);

  // White pass card overlapping the band
  const cardX = 7;
  const cardY = y + 25;
  const cardW = W - 14;
  const cardH = 76;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(cardX, cardY, cardW, cardH, 4, 4, "F");

  // QR column
  const qrSize = 32;
  const qrX = cardX + 5;
  const qrY = cardY + 7;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 2.5, 2.5, "F");
  doc.addImage(qr, "PNG", qrX, qrY, qrSize, qrSize);
  doc.setTextColor(...ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t.registrationId, qrX + qrSize / 2, qrY + qrSize + 10, { align: "center" });
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("Show this code at check-in", qrX + qrSize / 2, qrY + qrSize + 15, { align: "center" });

  // Details column
  const dx = qrX + qrSize + 7;
  const colW = cardX + cardW - 5 - dx;
  const col2 = dx + colW / 2 + 2;
  let dy = cardY + 11;

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(EVENT.codeFrom, dx, dy);
  doc.text(EVENT.codeTo, dx + colW, dy, { align: "right" });
  // Arrow drawn as lines — the built-in PDF font has no "→" glyph
  const ax = dx + colW / 2;
  const ay = dy - 2;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.6);
  doc.line(ax - 3, ay, ax + 3, ay);
  doc.line(ax + 3, ay, ax + 1.3, ay - 1.4);
  doc.line(ax + 3, ay, ax + 1.3, ay + 1.4);
  doc.setTextColor(...MUTED);
  doc.setFontSize(5.5);
  doc.text(String(t.city).toUpperCase(), dx, dy + 4.5);
  doc.text(String(EVENT.codeToLabel || EVENT.dateLabel).toUpperCase(), dx + colW, dy + 4.5, { align: "right" });

  const label = (text, x, yy) => {
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text(text.toUpperCase(), x, yy);
  };
  const value = (text, x, yy, size = 8.5, maxWidth = colW / 2 - 2) => {
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text || "—"), maxWidth).slice(0, 2);
    doc.text(lines, x, yy);
    return lines.length;
  };

  dy += 13;
  label("Date", dx, dy);
  label("Time", col2, dy);
  value(t.shortDate, dx, dy + 4.5);
  value(t.time, col2, dy + 4.5);

  dy += 12;
  label("Attendee", dx, dy);
  const nameLines = value(t.fullName, dx, dy + 5, 11, colW);
  dy += nameLines > 1 ? 16 : 12;

  label("Category", dx, dy);
  label("Region", col2, dy);
  value(t.category, dx, dy + 4.5);
  value(t.region, col2, dy + 4.5);

  // Dashed divider + venue
  const footY = cardY + cardH - 9;
  doc.setDrawColor(226, 232, 240);
  doc.setLineDashPattern([1, 1], 0);
  doc.setLineWidth(0.3);
  doc.line(cardX + 5, footY - 4, cardX + cardW - 5, footY - 4);
  doc.setLineDashPattern([], 0);
  doc.setTextColor(...SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(`${EVENT.venue} · ${EVENT.dateLabel}, ${EVENT.time}`, W / 2, footY + 1, { align: "center", maxWidth: cardW - 10 });

  // Organiser logos
  let ly = cardY + cardH + 6;
  if (orgLogo || partnerLogo) {
    const logoH = 13;
    const gap = 6;
    const widths = [orgLogo, partnerLogo].filter(Boolean).map((src) => {
      const { width, height } = doc.getImageProperties(src);
      return (width / height) * logoH;
    });
    let lx = (W - (widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1))) / 2;
    [orgLogo, partnerLogo].filter(Boolean).forEach((src, i) => {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(lx - 1.5, ly - 1.5, widths[i] + 3, logoH + 3, 2, 2, "F");
      addImageFit(doc, src, lx, ly, widths[i], logoH);
      lx += widths[i] + gap;
    });
    ly += logoH + 8;
  }

  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text(`Check-in powered by ${t.brandName}`, W / 2, Math.min(ly, H - 4), { align: "center" });

  doc.save(`ticket-${t.registrationId}.pdf`);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absoluteUrl(src) {
  return src ? new URL(src, window.location.origin).href : "";
}

/** Full HTML document for the printable ticket (exported so it can be previewed) */
export function buildTicketPrintHtml(attendee, qrSrc) {
  const t = getTicketFields(attendee);
  const flyer = absoluteUrl(EVENT.flyer);
  const logos = [EVENT.organizerLogo, EVENT.partnerLogo].filter(Boolean).map(absoluteUrl);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Ticket ${escapeHtml(t.registrationId)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: ${BG_HEX}; display: flex; justify-content: center; padding: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .wrap { width: 380px; border-radius: 24px; overflow: hidden; background: ${BG_HEX}; box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
  .flyer { display: block; width: 100%; height: 150px; object-fit: cover; object-position: center 22%; }
  .band { background: ${INK_HEX}; color: #fff; padding: ${flyer ? "12px" : "22px"} 20px 42px; }
  .band-k { font-size: 13px; opacity: 0.85; }
  .band-t { font-size: 28px; font-weight: 300; letter-spacing: 0.05em; text-transform: uppercase; margin-top: 4px; }
  .pass { display: flex; gap: 14px; margin: -26px 14px 0; padding: 16px; background: #fff; border-radius: 18px; box-shadow: 0 10px 28px rgba(0,0,0,0.08); }
  .qr-col { flex-shrink: 0; display: flex; align-items: center; background: #f8fafc; border-radius: 12px; padding: 6px; }
  .qr-col img { width: 120px; height: 120px; display: block; }
  .details { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
  .route { display: flex; align-items: center; justify-content: space-between; }
  .code { display: block; text-align: center; font-size: 24px; font-weight: 300; letter-spacing: 0.06em; color: ${INK_HEX}; }
  .sub { display: block; text-align: center; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
  .arrow { color: ${ACCENT_HEX}; font-size: 16px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 10px; }
  label { display: block; font-size: 8px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
  .val { font-size: 12px; font-weight: 700; color: ${INK_HEX}; margin-top: 2px; }
  .name { font-size: 17px; font-weight: 400; }
  .id-row { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px dashed #e2e8f0; padding-top: 6px; }
  .id { font-size: 20px; letter-spacing: 0.06em; color: ${ACCENT_HEX}; }
  .region { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; }
  .venue { text-align: center; font-size: 11px; color: #64748b; margin: 12px 16px 0; }
  .logos { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 12px 0 4px; }
  .logos img { height: 44px; width: auto; background: #fff; border-radius: 8px; padding: 3px; }
  .foot { text-align: center; font-size: 10px; color: #94a3b8; padding: 8px 10px 14px; }
  .chip { display: inline-block; margin-top: 6px; background: ${ACCENT_HEX}; color: ${ACCENT_INK_HEX}; border-radius: 999px; padding: 2px 10px; font-size: 10px; font-weight: 700; }
  @media print { body { background: #fff; padding: 0; } .wrap { box-shadow: none; } }
</style></head><body>
  <div class="wrap">
    ${flyer ? `<img class="flyer" src="${escapeHtml(flyer)}" alt="" />` : ""}
    <div class="band">
      <p class="band-k">${escapeHtml(checkedInLabel(attendee))}</p>
      <p class="band-t">You're checked in</p>
    </div>
    <div class="pass">
      <div class="qr-col"><img src="${qrSrc}" alt="QR ${escapeHtml(t.registrationId)}" /></div>
      <div class="details">
        <div class="route">
          <div><span class="code">${escapeHtml(EVENT.codeFrom)}</span><span class="sub">${escapeHtml(t.city)}</span></div>
          <span class="arrow">→</span>
          <div><span class="code">${escapeHtml(EVENT.codeTo)}</span><span class="sub">${escapeHtml(EVENT.codeToLabel || EVENT.dateLabel)}</span></div>
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
    <p class="venue">${escapeHtml(EVENT.venue)} · ${escapeHtml(EVENT.dateLabel)}, ${escapeHtml(EVENT.time)}</p>
    ${logos.length ? `<div class="logos">${logos.map((src) => `<img src="${escapeHtml(src)}" alt="" />`).join("")}</div>` : ""}
    <div class="foot">Check-in powered by ${escapeHtml(t.brandName)}</div>
  </div>
</body></html>`;
}

export async function printTicket(attendee) {
  // Open the window synchronously (inside the click) so popup blockers allow it.
  const win = window.open("", "_blank", "width=440,height=820");
  if (!win) {
    throw new Error("Pop-up blocked — allow pop-ups for this site to print tickets.");
  }
  win.document.write("<p style=\"font-family:sans-serif;padding:24px\">Preparing ticket…</p>");

  const qr = await qrDataUrl(getTicketFields(attendee).registrationId, 360);
  win.document.open();
  win.document.write(buildTicketPrintHtml(attendee, qr));
  win.document.close();

  // Print once the flyer, QR and logos have loaded.
  const doPrint = () => {
    win.focus();
    win.print();
  };
  win.onafterprint = () => win.close();
  if (win.document.readyState === "complete") {
    setTimeout(doPrint, 300);
  } else {
    win.addEventListener("load", () => setTimeout(doPrint, 150));
  }
}
