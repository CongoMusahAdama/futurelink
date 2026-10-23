import { CONTACT_EMAIL } from "./brand";

/**
 * Lightweight client-side gate for the operational screens (check-in, dashboard,
 * signage, admin). This keeps the public out of the ops tools. It is NOT a
 * substitute for real server-side authentication — anyone with the bundle can
 * read these values — but it is an effective deterrent for a small internal tool.
 *
 * Accounts come from the VITE_OPS_ACCOUNTS build variable (set in Vercel / local .env)
 * so passwords stay out of the repository. Format, comma-separated:
 *   VITE_OPS_ACCOUNTS=first@example.com:password1,second@example.com:password2
 *
 * Each parsed entry has:
 *   email       — lowercased for comparison
 *   password    — static password for this account
 *   isDefault   — if true, the system will prompt to change it on first login
 *   storageKey  — per-account localStorage key for a custom password
 */

const PRIMARY_EMAIL = CONTACT_EMAIL.toLowerCase();

function parseAccounts(raw) {
  return String(raw || "")
    .split(",")
    .map((entry) => {
      const sep = entry.indexOf(":");
      if (sep < 1) return null;
      const email = entry.slice(0, sep).trim().toLowerCase();
      const password = entry.slice(sep + 1).trim();
      if (!email || !password) return null;
      const isPrimary = email === PRIMARY_EMAIL;
      return {
        email,
        password,
        isDefault: isPrimary,
        storageKey: isPrimary ? "fl-ops-password" : `fl-ops-password-${email.split("@")[0]}`,
      };
    })
    .filter(Boolean)
    // Primary account first — the legacy single-account helpers below rely on it.
    .sort((a, b) => Number(b.email === PRIMARY_EMAIL) - Number(a.email === PRIMARY_EMAIL));
}

const ACCOUNTS = parseAccounts(import.meta.env.VITE_OPS_ACCOUNTS);

const AUTH_KEY = "fl-ops-auth";
const AUTH_EMAIL_KEY = "fl-ops-auth-email";
const TOKEN = "granted";

// ─── Helpers ───────────────────────────────────────────────────────────────

function getAccount(email) {
  const norm = String(email || "").trim().toLowerCase();
  return ACCOUNTS.find((a) => a.email === norm) ?? null;
}

function getStoredPassword(account) {
  if (!account) return null;
  try {
    return window.localStorage.getItem(account.storageKey);
  } catch {
    return null;
  }
}

export function getActivePassword(email) {
  const account = getAccount(email);
  if (!account) return null;
  return getStoredPassword(account) || account.password;
}

// ─── Legacy shim (used by OpsLogin for single-account flows) ───────────────

export const OPS_LOGIN_EMAIL = CONTACT_EMAIL;

/** Returns the effective password for the primary (legacy) account. */
export function getOpsPassword() {
  const account = ACCOUNTS[0];
  if (!account) return null;
  return getStoredPassword(account) || account.password;
}

/** True when the primary account is still using its factory default password. */
export function isUsingDefaultPassword() {
  return !getStoredPassword(ACCOUNTS[0]);
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export function verifyOpsCredentials(email, password) {
  const account = getAccount(email);
  if (!account) return false;
  const effective = getStoredPassword(account) || account.password;
  return password === effective;
}

export function loginOps(email, password) {
  if (!verifyOpsCredentials(email, password)) return false;
  try {
    window.localStorage.setItem(AUTH_KEY, TOKEN);
    window.localStorage.setItem(AUTH_EMAIL_KEY, String(email).trim().toLowerCase());
  } catch {
    // ignore storage failures; session simply won't persist
  }
  return true;
}

export function isOpsAuthed() {
  try {
    return window.localStorage.getItem(AUTH_KEY) === TOKEN;
  } catch {
    return false;
  }
}

/** Returns the email of the currently logged-in ops user, or null. */
export function getOpsEmail() {
  try {
    return window.localStorage.getItem(AUTH_EMAIL_KEY) || null;
  } catch {
    return null;
  }
}

/**
 * Returns true when the currently signed-in account is still on its
 * initial/default password (prompts the user to change it).
 */
export function isCurrentAccountUsingDefaultPassword() {
  const email = getOpsEmail();
  const account = getAccount(email);
  if (!account) return false;
  if (!account.isDefault) return false; // only primary account forces change
  return !getStoredPassword(account);
}

// ─── Password Change ────────────────────────────────────────────────────────

export function changeOpsPassword(currentPassword, nextPassword) {
  const email = getOpsEmail();
  const account = getAccount(email) ?? ACCOUNTS[0];
  if (!account) {
    return { ok: false, error: "No ops accounts are configured." };
  }
  const effective = getStoredPassword(account) || account.password;

  const next = String(nextPassword || "");
  if (currentPassword !== effective) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (next.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }
  if (next === effective) {
    return { ok: false, error: "Choose a different password from the current one." };
  }
  try {
    window.localStorage.setItem(account.storageKey, next);
  } catch {
    return { ok: false, error: "Could not save the new password on this device." };
  }
  return { ok: true };
}

// ─── Logout ────────────────────────────────────────────────────────────────

export function logoutOps() {
  try {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(AUTH_EMAIL_KEY);
  } catch {
    // ignore
  }
}
