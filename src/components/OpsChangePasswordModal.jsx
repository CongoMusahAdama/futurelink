import { useState } from "react";
import { KeyRound, X } from "lucide-react";
import { changeOpsPassword } from "../lib/opsAuth";

export default function OpsChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setSubmitting(false);
      return;
    }

    const result = changeOpsPassword(currentPassword, newPassword);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
    window.setTimeout(() => onClose?.(), 900);
  };

  return (
    <div
      className="ops-logout-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Change password"
      onClick={onClose}
    >
      <form
        className="ops-logout-modal ops-change-password-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <button type="button" className="ops-change-close" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </button>

        <span className="ops-logout-modal-icon ops-change-icon">
          <KeyRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 className="ops-logout-modal-title">Change password</h2>
        <p className="ops-logout-modal-text">
          Set a new password for signing into check-in, dashboard, and admin on this device.
        </p>

        <label className="ops-login-label" htmlFor="change-current">
          Current password
        </label>
        <input
          id="change-current"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="ops-login-input"
          required
        />

        <label className="ops-login-label" htmlFor="change-new">
          New password
        </label>
        <input
          id="change-new"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="ops-login-input"
          minLength={8}
          required
        />

        <label className="ops-login-label" htmlFor="change-confirm">
          Confirm new password
        </label>
        <input
          id="change-confirm"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="ops-login-input"
          minLength={8}
          required
        />

        {error && <p className="ops-login-error">{error}</p>}
        {success && <p className="ops-change-success">Password updated.</p>}

        <div className="ops-logout-modal-actions">
          <button type="button" className="ops-logout-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="ops-logout-confirm ops-change-save" disabled={submitting}>
            {submitting ? "Saving…" : "Save password"}
          </button>
        </div>
      </form>
    </div>
  );
}
