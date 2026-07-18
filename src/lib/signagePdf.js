import { jsPDF } from "jspdf";
import { BRAND_NAME } from "./brand";
import { TICKET_EVENT } from "./eventTicketMeta";

const NAVY = [0, 29, 74];
const MINT = [26, 251, 151];

const SIGNS = [
  {
    title: "REGISTRATION",
    subtitle: "Ghana Hubs Network AGM 2026 · Kumasi",
    hint: "Welcome — please register or check in here",
    num: "01",
  },
  {
    title: "FAST TRACK",
    subtitle: "QR Check-in",
    hint: "Already registered? Scan your QR code or enter your ID",
    num: "02",
  },
  {
    title: "HELP DESK",
    subtitle: "Assistance & walk-ins",
    hint: "New attendees · lost tickets · general support",
    num: "03",
  },
  {
    title: "VIP REGISTRATION",
    subtitle: "Speakers · Sponsors · Partners",
    hint: "Priority lane for VIP guests",
    num: "04",
  },
  {
    title: "WALK-IN REGISTRATION",
    subtitle: "On-site sign-up",
    hint: "Register now and check in instantly",
    num: "05",
  },
  {
    title: "ALREADY REGISTERED?",
    subtitle: "Scan here",
    hint: "Show your QR code or ticket at Fast Track",
    num: "06",
  },
  {
    title: "FAST LANE →",
    subtitle: "QR check-in only",
    hint: "Pre-registered attendees",
    num: "→",
  },
  {
    title: "HELP DESK →",
    subtitle: "Walk-ins & support",
    hint: "Please form a queue on the left",
    num: "→",
  },
  {
    title: "PLEASE WAIT HERE",
    subtitle: "Registration queue",
    hint: "Staff will assist you shortly",
    num: "⏳",
  },
];

function drawSign(doc, sign, pageW, pageH) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, pageH, "F");

  doc.setFillColor(...MINT);
  doc.rect(0, 0, pageW, 8, "F");

  doc.setFillColor(...MINT);
  doc.circle(20, 28, 12, "F");
  doc.setTextColor(...NAVY);
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(sign.num, 20, 30, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont(undefined, "bold");
  doc.text(sign.title, pageW / 2, 55, { align: "center", maxWidth: pageW - 30 });

  doc.setFontSize(16);
  doc.setFont(undefined, "normal");
  doc.text(sign.subtitle, pageW / 2, 68, { align: "center" });

  doc.setDrawColor(...MINT);
  doc.setLineWidth(0.8);
  doc.line(30, 78, pageW - 30, 78);

  doc.setFontSize(12);
  doc.setTextColor(200, 220, 240);
  doc.text(sign.hint, pageW / 2, 88, { align: "center", maxWidth: pageW - 40 });

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageW / 2 - 45, 100, 90, 22, 3, 3, "F");
  doc.setTextColor(...NAVY);
  doc.setFontSize(9);
  doc.text("GHANA HUBS NETWORK", pageW / 2, 108, { align: "center" });
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text(`AGM 2026 · ${TICKET_EVENT.location}`, pageW / 2, 115, { align: "center" });

  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...MINT);
  doc.text(`Smart check-in powered by ${BRAND_NAME}`, pageW / 2, pageH - 12, { align: "center" });
}

export function downloadSignagePackPdf() {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  SIGNS.forEach((sign, i) => {
    if (i > 0) doc.addPage();
    drawSign(doc, sign, pageW, pageH);
  });

  doc.save("ghn-agm-registration-signage-pack.pdf");
}

export { SIGNS };
