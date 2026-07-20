import { useState } from "react";
import { ArrowLeft, KeyRound, Lock, LogIn } from "lucide-react";
import { BRAND_NAME, LOGO_SRC } from "../lib/brand";
import {
  changeOpsPassword,
  isUsingDefaultPassword,
  loginOps,
} from "../lib/opsAuth";

export default function OpsLogin({ onSuccess, title = "Operations Login" }) {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    // First login (still on the starter password) → require a personal password.
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
      <aside className="ops-login-hero">
        <div className="ops-login-hero-top">
          <img src={LOGO_SRC} alt={BRAND_NAME} className="ops-login-hero-logo" />
        </div>
        <div className="ops-login-hero-body">
          <h2 className="ops-login-hero-title">
            Smart Event Check-In &amp; Live Intelligence.
          </h2>
          <p className="ops-login-hero-copy">
            Private operations console for registration, QR check-in, live dashboards,
            and on-site badge printing across Ghana.
          </p>
          <ul className="ops-login-hero-points">
            <li>Fast-lane QR check-in</li>
            <li>Real-time attendance dashboard</li>
            <li>On-site badge &amp; signage tools</li>
          </ul>
        </div>
        <p className="ops-login-hero-foot">{BRAND_NAME}</p>
      </aside>

      <div className="ops-login-panel">
        {step === "login" ? (
          <form className="ops-login-form" onSubmit={handleLogin}>
            <span className="ops-login-lock">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>

            <h1 className="ops-login-title">{title}</h1>
            <p className="ops-login-subtitle">
              This area is private. Sign in with your Future-Link credentials to continue.
            </p>

            <label className="ops-login-label" htmlFor="ops-email">
              Email
            </label>
            <input
              id="ops-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@future-link"
              className="ops-login-input"
              required
            />

            <label className="ops-login-label" htmlFor="ops-password">
              Password
            </label>
            <input
              id="ops-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="ops-login-input"
              required
            />

            {error && <p className="ops-login-error">{error}</p>}

            <button type="submit" className="ops-login-btn" disabled={submitting}>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              {submitting ? "Signing in…" : "Sign in"}
            </button>

            <a href="#" className="ops-login-back">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to website
            </a>
          </form>
        ) : (
          <form className="ops-login-form" onSubmit={handleChangePassword}>
            <span className="ops-login-lock">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            </span>

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
    </div>
  );
}
