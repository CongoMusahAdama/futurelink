import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { BRAND_NAME, SELF_CHECKIN_URL } from "./brand";
import { EVENT } from "../data/checkin";
import { ACCENT, ACCENT_INK, BG, INK, loadCoverCrop, loadImageDataUrl } from "./eventTheme";

const SLATE = [100, 116, 139];

/** Draw an image inside a box, keeping its aspect ratio; returns the drawn width */
function addImageFit(doc, dataUrl, x, y, maxW, maxH) {
  const { width, height } = doc.getImageProperties(dataUrl);
  const scale = Math.min(maxW / width, maxH / height);
  const w = width * scale;
  const h = height * scale;
  doc.addImage(dataUrl, x, y + (maxH - h) / 2, w, h);
  return w;
}

/** A4 poster with a QR code that opens the self check-in page on attendees' phones. */
export async function downloadSelfCheckInPosterPdf() {
  const W = 210;
  const H = 297;
  const flyerH = 70;

  const [qr, flyer, orgLogo, partnerLogo] = await Promise.all([
    QRCode.toDataURL(SELF_CHECKIN_URL, {
      width: 900,
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#0f172a", light: "#ffffff" },
    }),
    loadCoverCrop(EVENT.flyer, W / flyerH, 0.23),
    loadImageDataUrl(EVENT.organizerLogo),
    loadImageDataUrl(EVENT.partnerLogo),
  ]);

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  doc.setFillColor(...BG);
  doc.rect(0, 0, W, H, "F");

  if (flyer) doc.addImage(flyer, "JPEG", 0, 0, W, flyerH);

  // Headline band
  doc.setFillColor(...INK);
  doc.rect(0, flyerH, W, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.text("SCAN TO CHECK IN", W / 2, flyerH + 16, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.text("Point your phone camera at the code - no app needed", W / 2, flyerH + 25, { align: "center" });

  // QR card
  const cardX = 30;
  const cardY = flyerH + 38;
  const cardW = W - 60;
  const cardH = 116;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(cardX, cardY, cardW, cardH, 6, 6, "F");
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(1.2);
  doc.roundedRect(cardX, cardY, cardW, cardH, 6, 6, "S");
  const qrSize = 94;
  doc.addImage(qr, "PNG", (W - qrSize) / 2, cardY + 6, qrSize, qrSize);
  doc.setTextColor(...ACCENT);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(SELF_CHECKIN_URL.replace(/^https?:\/\//, ""), W / 2, cardY + cardH - 7, { align: "center" });

  // Three steps
  const steps = ["Scan the code with your phone camera", "Enter your name and phone number", "Show your ticket at the desk"];
  const stepY = cardY + cardH + 13;
  const colW = (W - 30) / 3;
  steps.forEach((text, i) => {
    const cx = 15 + colW * i + colW / 2;
    doc.setFillColor(...ACCENT);
    doc.circle(cx, stepY, 5.5, "F");
    doc.setTextColor(...ACCENT_INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(String(i + 1), cx, stepY + 1.6, { align: "center" });
    doc.setTextColor(...INK);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(text, colW - 10), cx, stepY + 12, { align: "center" });
  });

  // Event line + logos
  doc.setTextColor(...SLATE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text(`${EVENT.title} · ${EVENT.dateLabel}, ${EVENT.time} · ${EVENT.venue}`, W / 2, stepY + 25, { align: "center", maxWidth: W - 30 });

  const logos = [orgLogo, partnerLogo].filter(Boolean);
  if (logos.length) {
    const logoH = 13;
    const gap = 8;
    const widths = logos.map((src) => {
      const { width, height } = doc.getImageProperties(src);
      return (width / height) * logoH;
    });
    let lx = (W - (widths.reduce((a, b) => a + b, 0) + gap * (logos.length - 1))) / 2;
    const ly = H - 27;
    logos.forEach((src, i) => {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(lx - 2, ly - 2, widths[i] + 4, logoH + 4, 2, 2, "F");
      addImageFit(doc, src, lx, ly, widths[i], logoH);
      lx += widths[i] + gap;
    });
  }

  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE);
  doc.text(`Check-in powered by ${BRAND_NAME}`, W / 2, H - 6, { align: "center" });

  doc.save(`${EVENT.fileSlug}-self-checkin-qr-poster.pdf`);
}
