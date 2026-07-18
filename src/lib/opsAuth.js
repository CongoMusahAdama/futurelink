import { CONTACT_EMAIL } from "./brand";

/**
 * Lightweight client-side gate for the operational screens (check-in, dashboard,
 * signage, admin). This keeps the public out of the ops tools. It is NOT a
 * substitute for real server-side authentication — anyone with the bundle can
 * read these values — but it is an effective deterrent for a small internal tool.
 */

export const OPS_LOGIN_EMAIL = CONTACT_EMAIL;
const OPS_PASSWORD = "futurelink@checking12345";
const STORAGE_KEY = "fl-ops-auth";
const TOKEN = "granted";

export function isOpsAuthed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === TOKEN;
  } catch {
    return false;
  }
}

export function verifyOpsCredentials(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return normalizedEmail === OPS_LOGIN_EMAIL.toLowerCase() && password === OPS_PASSWORD;
}

export function loginOps(email, password) {
  if (!verifyOpsCredentials(email, password)) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, TOKEN);
  } catch {
    // ignore storage failures; session simply won't persist
  }
  return true;
}

export function logoutOps() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
