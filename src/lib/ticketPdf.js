import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { getTicketFields } from "./eventTicketMeta";
import { EVENT } from "../data/checkin";
import {
  ACCENT,
  BG,
  INK,
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


export function getBadge80x80Fields(attendee) {
  const rawName =
    attendee?.fullName ||
    attendee?.name ||
    attendee?.preferredName ||
    "ATTENDEE";
  const rawOrg =
    attendee?.organisation ||
    attendee?.organization ||
    attendee?.company ||
    attendee?.org ||
    "";

  return {
    name: String(rawName).trim().toUpperCase(),
    organisation: String(rawOrg).trim().toUpperCase(),
  };
}

/**
 * 80mm × 80mm check-in badge print layout.
 * Strictly prints ONLY the registrant's NAME and ORGANIZATION,
 * well-centered, professional typography, in ALL CAPS, 1 badge per sheet.
 */
export function buildTicketPrintHtml(attendee) {
  const { name, organisation } = getBadge80x80Fields(attendee);

  // Dynamic font sizing based on length so it fits elegantly inside 80mm x 80mm
  const nameLen = name.length;
  let nameSizePt = 22;
  if (nameLen > 32) {
    nameSizePt = 13.5;
  } else if (nameLen > 22) {
    nameSizePt = 16.5;
  } else if (nameLen > 14) {
    nameSizePt = 19;
  }

  const orgLen = organisation.length;
  let orgSizePt = 11;
  if (orgLen > 36) {
    orgSizePt = 8.5;
  } else if (orgLen > 24) {
    orgSizePt = 9.5;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} - Check-in Badge</title>
  <style>
    @page {
      size: 80mm 80mm;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 80mm;
      height: 80mm;
      max-width: 80mm;
      max-height: 80mm;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff;
      color: #000000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      overflow: hidden;
      page-break-before: avoid !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      break-before: avoid !important;
      break-after: avoid !important;
      break-inside: avoid !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .badge-sheet {
      width: 80mm;
      height: 80mm;
      max-width: 80mm;
      max-height: 80mm;
      box-sizing: border-box;
      padding: 6mm 6mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      overflow: hidden;
      page-break-before: avoid !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      break-before: avoid !important;
      break-after: avoid !important;
      break-inside: avoid !important;
    }
    .badge-name {
      font-size: ${nameSizePt}pt;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #000000;
      word-break: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
      text-align: center;
    }
    .badge-org {
      margin-top: 4.5mm;
      font-size: ${orgSizePt}pt;
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #000000;
      word-break: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
      text-align: center;
    }
    @media screen {
      html, body {
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
        background: #0f172a;
      }
      .badge-sheet {
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      }
    }
    @media print {
      html, body {
        width: 80mm !important;
        height: 80mm !important;
        max-width: 80mm !important;
        max-height: 80mm !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        overflow: hidden !important;
      }
      .badge-sheet {
        width: 80mm !important;
        height: 80mm !important;
        max-width: 80mm !important;
        max-height: 80mm !important;
        box-sizing: border-box !important;
        padding: 6mm 6mm !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: hidden !important;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
        break-before: avoid !important;
        break-after: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="badge-sheet">
    <div class="badge-name">${escapeHtml(name)}</div>
    ${organisation ? `<div class="badge-org">${escapeHtml(organisation)}</div>` : ""}
  </div>
</body>
</html>`;
}

/** Print the 80mm × 80mm check-in badge on a single sheet */
export async function printTicket(attendee) {
  // Open the window synchronously (inside user click) to avoid popup blockers
  const win = window.open("", "_blank", "width=440,height=480");
  if (!win) {
    throw new Error("Pop-up blocked — allow pop-ups for this site to print badges.");
  }

  const html = buildTicketPrintHtml(attendee);
  win.document.open();
  win.document.write(html);
  win.document.close();

  const doPrint = () => {
    try {
      win.focus();
      win.print();
    } catch {
      // ignore
    }
  };

  win.onafterprint = () => {
    try {
      win.close();
    } catch {
      // ignore
    }
  };

  if (win.document.readyState === "complete") {
    setTimeout(doPrint, 250);
  } else {
    win.addEventListener("load", () => setTimeout(doPrint, 150));
  }
}

/** Download the 80mm × 80mm check-in badge as a single-page PDF */
export async function downloadBadge80x80Pdf(attendee) {
  const { name, organisation } = getBadge80x80Fields(attendee);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 80],
  });

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 80, 80, "F");

  const cx = 40;
  const maxW = 68;

  const nameLen = name.length;
  const nameFontSize = nameLen > 32 ? 13.5 : nameLen > 22 ? 16.5 : nameLen > 14 ? 19 : 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(nameFontSize);
  const nameLines = doc.splitTextToSize(name, maxW);
  const nameLineH = nameFontSize * 0.42;
  const totalNameH = nameLines.length * nameLineH;

  if (organisation) {
    const orgLen = organisation.length;
    const orgFontSize = orgLen > 36 ? 8.5 : orgLen > 24 ? 9.5 : 11;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(orgFontSize);
    const orgLines = doc.splitTextToSize(organisation, maxW);
    const orgLineH = orgFontSize * 0.42;
    const totalOrgH = orgLines.length * orgLineH;
    const gap = 4.5;
    const totalH = totalNameH + gap + totalOrgH;

    let y = (80 - totalH) / 2 + nameLineH * 0.8;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(nameFontSize);
    nameLines.forEach((line) => {
      doc.text(line, cx, y, { align: "center" });
      y += nameLineH;
    });

    y += gap - nameLineH + orgLineH * 0.8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(orgFontSize);
    doc.setTextColor(0, 0, 0);
    orgLines.forEach((line) => {
      doc.text(line, cx, y, { align: "center" });
      y += orgLineH;
    });
  } else {
    let y = (80 - totalNameH) / 2 + nameLineH * 0.8;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(nameFontSize);
    nameLines.forEach((line) => {
      doc.text(line, cx, y, { align: "center" });
      y += nameLineH;
    });
  }

  const safeSlug = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() || "badge";
  doc.save(`badge-80x80-${safeSlug}.pdf`);
}
