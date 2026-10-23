import { jsPDF } from "jspdf";
import { BADGE_ROLES, BADGE_SPEC, getBadgeFields, getRoleColors } from "./badgeMeta";
import { EVENT } from "../data/checkin";
import { ACCENT, INK, loadImageDataUrl } from "./eventTheme";
import { printTicket, downloadBadge80x80Pdf } from "./ticketPdf";

const IN = 25.4;
const WHITE = [255, 255, 255];

const TRIM_W = BADGE_SPEC.trimWidthIn * IN;
const TRIM_H = BADGE_SPEC.trimHeightIn * IN;
const BLEED = BADGE_SPEC.bleedIn * IN;
const SAFE = BADGE_SPEC.safeIn * IN;
const PAGE_W = TRIM_W + BLEED * 2;
const PAGE_H = TRIM_H + BLEED * 2;

/** Draw an image inside a box, keeping its aspect ratio; returns the drawn width */
function addImageFit(doc, dataUrl, x, y, maxW, maxH) {
  const { width, height } = doc.getImageProperties(dataUrl);
  const scale = Math.min(maxW / width, maxH / height);
  const w = width * scale;
  const h = height * scale;
  doc.addImage(dataUrl, x, y + (maxH - h) / 2, w, h);
  return w;
}

function drawCropMarks(doc) {
  const len = 4;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  const x0 = BLEED;
  const y0 = BLEED;
  const x1 = BLEED + TRIM_W;
  const y1 = BLEED + TRIM_H;
  // corners
  [[x0, y0, -1, -1], [x1, y0, 1, -1], [x0, y1, -1, 1], [x1, y1, 1, 1]].forEach(([x, y, dx, dy]) => {
    doc.line(x, y, x + dx * len, y);
    doc.line(x, y, x, y + dy * len);
  });
}

async function drawBadgeFace(doc, fields, { showCropMarks = true, placeholderName = false } = {}) {
  const cx = PAGE_W / 2;
  const contentLeft = BLEED + SAFE;
  const contentW = TRIM_W - SAFE * 2;
  const roleColors = getRoleColors(fields.role);

  // Background (full page including bleed)
  doc.setFillColor(...INK);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Top accent stripe
  doc.setFillColor(...ACCENT);
  doc.rect(BLEED, BLEED, TRIM_W, 2.5, "F");

  if (showCropMarks) drawCropMarks(doc);

  // Punch hole slot
  const slotW = 14;
  const slotH = 3.5;
  doc.setFillColor(240, 244, 248);
  doc.roundedRect(cx - slotW / 2, BLEED + 5, slotW, slotH, 1.5, 1.5, "F");

  // White org pill with subtle shadow
  const pillY = BLEED + 12;
  const pillH = 14;
  doc.setFillColor(0, 15, 40);
  doc.roundedRect(contentLeft + 0.6, pillY + 0.6, contentW, pillH, 4, 4, "F");
  doc.setFillColor(...WHITE);
  doc.roundedRect(contentLeft, pillY, contentW, pillH, 4, 4, "F");

  const [orgLogo, partnerLogo] = await Promise.all([
    loadImageDataUrl(fields.orgLogo),
    loadImageDataUrl(fields.partnerLogo),
  ]);
  let textX = contentLeft + 6;
  // A wide logo already carries the organiser's name, so skip the text name.
  let logoIsWordmark = false;
  if (orgLogo) {
    const { width, height } = doc.getImageProperties(orgLogo);
    logoIsWordmark = width / height > 1.8;
    textX = contentLeft + 3 + addImageFit(doc, orgLogo, contentLeft + 3, pillY + 2, 34, 10) + 3;
  }
  if (partnerLogo) {
    addImageFit(doc, partnerLogo, contentLeft + contentW - 13, pillY + 2, 10, 10);
  }
  if (!logoIsWordmark) {
    doc.setTextColor(...INK);
    doc.setFontSize(8);
    doc.setFont(undefined, "bold");
    doc.text(fields.organizationName, textX, pillY + 7.5);
  }
  doc.setFontSize(5);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 116, 139);
  if (logoIsWordmark) {
    doc.text("Powered by", textX, pillY + 6.5);
    doc.text(fields.poweredBy, textX, pillY + 9.5);
  } else {
    doc.text(`Powered by ${fields.poweredBy}`, textX, pillY + 11);
  }

  let y = pillY + pillH + 7;

  // Event title
  doc.setTextColor(...WHITE);
  doc.setFontSize(10.5);
  doc.setFont(undefined, "bold");
  doc.text(fields.eventTitle, cx, y, { align: "center", maxWidth: contentW });
  y += 5.5;

  doc.setFontSize(6.5);
  doc.setFont(undefined, "normal");
  doc.setTextColor(180, 200, 220);
  doc.text(fields.eventSubtitle, cx, y, { align: "center" });
  y += 7;

  // Theme label + box
  doc.setTextColor(...ACCENT);
  doc.setFontSize(5);
  doc.setFont(undefined, "bold");
  doc.text(fields.themeLabel, contentLeft, y);
  y += 2.5;

  const themeH = 11;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.35);
  doc.roundedRect(contentLeft, y, contentW, themeH, 2, 2, "S");
  doc.setTextColor(...WHITE);
  doc.setFontSize(5.5);
  doc.setFont(undefined, "bold");
  const quote = `"${fields.themeQuote.toUpperCase()}"`;
  doc.text(quote, cx, y + 7, { align: "center", maxWidth: contentW - 4 });
  y += themeH + 5;

  // Attendee name
  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  const displayName = placeholderName ? "ATTENDEE NAME" : fields.fullName;
  doc.text(displayName, cx, y, { align: "center", maxWidth: contentW });
  y += 7;

  if (!placeholderName && fields.organisation) {
    doc.setFontSize(6.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(160, 185, 210);
    doc.text(fields.organisation, cx, y, { align: "center", maxWidth: contentW });
    y += 5;
  }

  // Role pill — hero element with role color
  const roleH = 18;
  const roleY = y;
  doc.setFillColor(0, 15, 40);
  doc.roundedRect(contentLeft + 5, roleY + 0.8, contentW - 10, roleH, 4.5, 4.5, "F");
  doc.setFillColor(...roleColors.fill);
  doc.roundedRect(contentLeft + 4, roleY, contentW - 8, roleH, 4.5, 4.5, "F");
  doc.setTextColor(...roleColors.text);
  doc.setFontSize(15);
  doc.setFont(undefined, "bold");
  doc.text(fields.role, cx, roleY + 12, { align: "center" });
  y += roleH + 7;

  // Contact
  if (fields.phones) {
    doc.setTextColor(...WHITE);
    doc.setFontSize(6);
    doc.setFont(undefined, "normal");
    doc.text(`Contact: ${fields.phones}`, cx, y, { align: "center" });
    y += 5;
  }

  // Footer divider + web/email
  const footY = BLEED + TRIM_H - SAFE - 10;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.25);
  doc.line(contentLeft, footY, contentLeft + contentW, footY);

  doc.setFillColor(...WHITE);
  doc.rect(contentLeft, footY + 0.3, contentW, BLEED + SAFE + 7, "F");
  doc.setTextColor(...INK);
  doc.setFontSize(4.8);
  doc.setFont(undefined, "normal");
  doc.text(`${fields.website}  |  ${fields.email}`, cx, footY + 5.5, { align: "center" });

  if (!placeholderName && fields.registrationId) {
    doc.setFontSize(4.2);
    doc.setTextColor(100, 116, 139);
    doc.text(fields.registrationId, cx, footY + 8.5, { align: "center" });
  }
}

function drawAccentDot(doc, x, y, r = 1.2) {
  doc.setFillColor(...ACCENT);
  doc.circle(x, y, r, "F");
}

/** Repeat unit width for tiling along a long strap */
function measureLanyardTile(doc, phrases, fontSize, gap) {
  doc.setFontSize(fontSize);
  doc.setFont(undefined, "bold");
  let w = 12;
  phrases.forEach((phrase, idx) => {
    w += doc.getTextWidth(phrase);
    if (idx < phrases.length - 1) w += gap;
  });
  return w;
}

function drawLanyardTile(doc, x, y, phrases, fontSize, gap) {
  doc.setFontSize(fontSize);
  doc.setFont(undefined, "bold");
  doc.setTextColor(...INK);

  let cx = x + 6;
  phrases.forEach((phrase, idx) => {
    doc.text(phrase, cx, y);
    cx += doc.getTextWidth(phrase);
    if (idx < phrases.length - 1) {
      drawAccentDot(doc, cx + gap / 2, y - 1.5, 1.1);
      cx += gap;
    }
  });
}

function drawLanyardStrip(doc) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = Math.max(BLEED, 8);
  const stripH = 34;
  const y0 = (pageH - stripH) / 2;
  const left = margin;
  const width = pageW - margin * 2;

  doc.setFillColor(...WHITE);
  doc.rect(left, y0, width, stripH, "F");

  doc.setFillColor(...ACCENT);
  doc.rect(left, y0, width, 3, "F");
  doc.rect(left, y0 + stripH - 3, width, 3, "F");

  const phrases = EVENT.lanyardPhrases;
  const fontSize = width > 200 ? 9 : 7.5;
  const gap = 7;
  const tileW = measureLanyardTile(doc, phrases, fontSize, gap);
  const textY = y0 + stripH / 2 + 2.5;

  let x = left;
  while (x + tileW <= left + width + 0.5) {
    drawLanyardTile(doc, x, textY, phrases, fontSize, gap);
    x += tileW;
  }

  doc.setFontSize(6);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Lanyard strap pattern - repeat tile along 36 inch strap - sublimation or screen print",
    pageW / 2,
    y0 + stripH + 8,
    { align: "center" }
  );
}

function newBadgeDoc() {
  return new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [PAGE_W, PAGE_H],
  });
}

/** Personal badge for one attendee (3.5×5.5" + bleed) */
export async function downloadNameBadgePdf(attendee) {
  const fields = getBadgeFields(attendee);
  const doc = newBadgeDoc();
  await drawBadgeFace(doc, fields);
  doc.save(`badge-${fields.registrationId || fields.fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

/** Blank role templates — one page per role for bulk printing */
export async function downloadRoleBadgeTemplatesPdf() {
  const doc = newBadgeDoc();

  for (let i = 0; i < BADGE_ROLES.length; i++) {
    if (i > 0) doc.addPage([PAGE_W, PAGE_H]);
    const fields = getBadgeFields({ fullName: "ATTENDEE NAME", category: BADGE_ROLES[i] });
    await drawBadgeFace(doc, fields, { placeholderName: true });
  }

  doc.addPage([PAGE_W, PAGE_H]);
  drawLanyardStrip(doc);

  doc.save(`${EVENT.fileSlug}-name-badge-role-templates.pdf`);
}

/** Lanyard strap pattern page only (landscape A4 for a wide repeat preview) */
export function downloadLanyardStrapPdf() {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  drawLanyardStrip(doc);
  doc.save(`${EVENT.fileSlug}-lanyard-strap-pattern.pdf`);
}

export { downloadBadge80x80Pdf };

export function printNameBadge(attendee) {
  return printTicket(attendee);
}
