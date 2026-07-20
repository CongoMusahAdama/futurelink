import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react";
import {
  BRAND_NAME,
  CONTACT_EMAIL,
  LOGO_ON_DARK_SRC,
  LOGO_SRC,
} from "../lib/brand";
import {
  changeOpsPassword,
  isUsingDefaultPassword,
  loginOps,
} from "../lib/opsAuth";

const REMEMBER_KEY = "fl-ops-remember-email";

function readRememberedEmail() {
  try {
    return window.localStorage.getItem(REMEMBER_KEY) || "";
  } catch {
    return "";
  }
}

export default function OpsLogin({ onSuccess, title = "Operations Login" }) {
  const remembered = readRememberedEmail();
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState(remembered || CONTACT_EMAIL);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(remembered));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const ok = loginOps(email, password);
    if (!ok) {
      setError("Incorrect email or password. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      if (rememberMe) {
        window.localStorage.setItem(REMEMBER_KEY, email.trim());
      } else {
        window.localStorage.removeItem(REMEMBER_KEY);
      }
    } catch {
      // ignore
    }

    if (isUsingDefaultPassword()) {
      setStep("change");
      setSubmitting(false);
      return;
    }

    onSuccess?.();
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setSubmitting(false);
      return;
    }

    const result = changeOpsPassword(password, newPassword);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    onSuccess?.();
  };

  return (
    <div className="ops-login">
      <div className="ops-login-shell">
        <div className="ops-login-panel">
          <a href="#" className="ops-login-back">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to website
          </a>

          {step === "login" ? (
            <form className="ops-login-form" onSubmit={handleLogin}>
              <img src={LOGO_SRC} alt={BRAND_NAME} className="ops-login-brand-mark" />
              <h1 className="ops-login-title">{title}</h1>
              <p className="ops-login-subtitle">
                Welcome back. Please sign in to your Future-Link operations account.
              </p>

              <label className="ops-login-label" htmlFor="ops-email">
                Email address
              </label>
              <input
                id="ops-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={CONTACT_EMAIL}
                className="ops-login-input"
                required
              />

              <label className="ops-login-label" htmlFor="ops-password">
                Password
              </label>
              <div className="ops-login-password-wrap">
                <input
                  id="ops-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="ops-login-input"
                  required
                />
                <button
                  type="button"
                  className="ops-login-eye"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="ops-login-meta">
                <label className="ops-login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <a href={`mailto:${CONTACT_EMAIL}`} className="ops-login-forgot">
                  Forgot password?
                </a>
              </div>

              {error && <p className="ops-login-error">{error}</p>}

              <button type="submit" className="ops-login-btn" disabled={submitting}>
                {submitting ? "Signing in…" : "Login"}
              </button>
            </form>
          ) : (
            <form className="ops-login-form" onSubmit={handleChangePassword}>
              <img src={LOGO_SRC} alt={BRAND_NAME} className="ops-login-brand-mark" />
              <h1 className="ops-login-title">Set your password</h1>
              <p className="ops-login-subtitle">
                Choose a new password you&apos;ll remember. You&apos;ll use this next time you
                sign in on this device.
              </p>

              <label className="ops-login-label" htmlFor="ops-new-password">
                New password
              </label>
              <input
                id="ops-new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="ops-login-input"
                minLength={8}
                required
              />

              <label className="ops-login-label" htmlFor="ops-confirm-password">
                Confirm new password
              </label>
              <input
                id="ops-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="ops-login-input"
                minLength={8}
                required
              />

              {error && <p className="ops-login-error">{error}</p>}

              <button type="submit" className="ops-login-btn" disabled={submitting}>
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                {submitting ? "Saving…" : "Save password & continue"}
              </button>
            </form>
          )}
        </div>

        <aside className="ops-login-visual" aria-hidden="true">
          <img
            src="/services/event-checkin.jpg"
            alt=""
            className="ops-login-visual-image"
          />
          <div className="ops-login-visual-overlay" />
          <div className="ops-login-visual-content">
            <img
              src={LOGO_ON_DARK_SRC}
              alt=""
              className="ops-login-visual-logo"
            />
            <p className="ops-login-visual-tagline">Skills. Business. Opportunity.</p>
            <p className="ops-login-visual-copy">
              Private console for QR check-in, live dashboards, and on-site event tools.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
