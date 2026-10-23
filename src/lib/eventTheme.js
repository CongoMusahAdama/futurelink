import { EVENT } from "../data/checkin";

/** "#7a0d45" → [122, 13, 69]; returns null for anything else */
export function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const theme = EVENT.ticketTheme || {};

/** Event colours for PDFs, falling back to the Future-Link navy / mint */
export const INK = hexToRgb(theme.ink) || [0, 29, 74];
export const ACCENT = hexToRgb(theme.accent) || [26, 251, 151];
export const ACCENT_INK = hexToRgb(theme.accentInk) || [0, 29, 74];
export const BG = hexToRgb(theme.bg) || [238, 244, 251];

export const INK_HEX = theme.ink || "#001d4a";
export const ACCENT_HEX = theme.accent || "#1afb97";
export const ACCENT_INK_HEX = theme.accentInk || "#001d4a";
export const BG_HEX = theme.bg || "#eef4fb";

/** Fetch an image as a data URL (null on failure, so PDFs still render without it) */
export async function loadImageDataUrl(src) {
  if (!src) return null;
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Crop an image to the given width/height ratio (like CSS object-fit: cover),
 * anchored `yPct` of the way down. Returns a JPEG data URL, or null on failure.
 */
export async function loadCoverCrop(src, ratio, yPct = 0.5) {
  if (!src) return null;
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = src;
    });
    let sw = img.naturalWidth;
    let sh = sw / ratio;
    if (sh > img.naturalHeight) {
      sh = img.naturalHeight;
      sw = sh * ratio;
    }
    const sx = (img.naturalWidth - sw) / 2;
    const sy = (img.naturalHeight - sh) * yPct;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(sw);
    canvas.height = Math.round(sh);
    canvas.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.9);
  } catch {
    return null;
  }
}
