/**
 * Server-side check of an ops login against VITE_OPS_ACCOUNTS
 * (comma-separated email:password pairs — the same variable the frontend uses).
 */
export function verifyOpsLogin(email, password) {
  const wantEmail = String(email || "").trim().toLowerCase();
  const wantPassword = String(password || "");
  if (!wantEmail || !wantPassword) return false;
  return String(process.env.VITE_OPS_ACCOUNTS || "")
    .split(",")
    .some((entry) => {
      const sep = entry.indexOf(":");
      if (sep < 1) return false;
      return entry.slice(0, sep).trim().toLowerCase() === wantEmail && entry.slice(sep + 1).trim() === wantPassword;
    });
}
