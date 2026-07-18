import { useState } from "react";
import { ArrowLeft, Lock, LogIn } from "lucide-react";
import { BRAND_NAME, LOGO_SRC } from "../lib/brand";
import { loginOps } from "../lib/opsAuth";

export default function OpsLogin({ onSuccess, title = "Operations Login" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const ok = loginOps(email, password);
    if (ok) {
      onSuccess?.();
    } else {
      setError("Incorrect email or password. Please try again.");
      setSubmitting(false);
    }
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
        <form className="ops-login-form" onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
}
