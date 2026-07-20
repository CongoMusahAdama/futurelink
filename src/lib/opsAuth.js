import { CONTACT_EMAIL } from "./brand";

/**
 * Lightweight client-side gate for the operational screens (check-in, dashboard,
 * signage, admin). This keeps the public out of the ops tools. It is NOT a
 * substitute for real server-side authentication — anyone with the bundle can
 * read these values — but it is an effective deterrent for a small internal tool.
 */

export const OPS_LOGIN_EMAIL = CONTACT_EMAIL;
const DEFAULT_PASSWORD = "futurelink@checking12345";
const AUTH_KEY = "fl-ops-auth";
const PASSWORD_KEY = "fl-ops-password";
const TOKEN = "granted";

function readStoredPassword() {
  try {
    return window.localStorage.getItem(PASSWORD_KEY);
  } catch {
    return null;
  }
}

export function getOpsPassword() {
  return readStoredPassword() || DEFAULT_PASSWORD;
}

export function isUsingDefaultPassword() {
  return !readStoredPassword();
}

export function isOpsAuthed() {
  try {
    return window.localStorage.getItem(AUTH_KEY) === TOKEN;
  } catch {
    return false;
  }
}

export function verifyOpsCredentials(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  return (
    normalizedEmail === OPS_LOGIN_EMAIL.toLowerCase() &&
    password === getOpsPassword()
  );
}

export function loginOps(email, password) {
  if (!verifyOpsCredentials(email, password)) return false;
  try {
    window.localStorage.setItem(AUTH_KEY, TOKEN);
  } catch {
    // ignore storage failures; session simply won't persist
  }
  return true;
}

export function changeOpsPassword(currentPassword, nextPassword) {
  const next = String(nextPassword || "");
  if (currentPassword !== getOpsPassword()) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (next.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }
  if (next === currentPassword) {
    return { ok: false, error: "Choose a different password from the current one." };
  }
  try {
    window.localStorage.setItem(PASSWORD_KEY, next);
  } catch {
    return { ok: false, error: "Could not save the new password on this device." };
  }
  return { ok: true };
}

export function logoutOps() {
  try {
    window.localStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
}
