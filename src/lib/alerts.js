import Swal from "sweetalert2";
import { ACCENT_HEX, ACCENT_INK_HEX, INK_HEX } from "./eventTheme";

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const base = {
  confirmButtonColor: ACCENT_HEX,
  color: INK_HEX,
  customClass: { popup: "fl-swal-popup", confirmButton: "fl-swal-confirm" },
  didOpen: (popup) => popup.style.setProperty("--fl-swal-confirm-ink", ACCENT_INK_HEX),
};

/** Celebrate a successful registration or check-in, then reveal the ticket. */
export function alertCheckedIn(attendee, { isNew = false } = {}) {
  const name = escapeHtml(attendee?.preferredName || attendee?.fullName || "Attendee");
  const id = escapeHtml(attendee?.registrationId);
  return Swal.fire({
    ...base,
    icon: "success",
    iconColor: ACCENT_HEX,
    title: isNew ? "Registered & checked in!" : "Welcome — you're checked in!",
    html: `<p class="fl-swal-name">${name}</p>${id ? `<p class="fl-swal-id">${id}</p>` : ""}`,
    confirmButtonText: "View ticket",
    timer: 3500,
    timerProgressBar: true,
  });
}

/** Attendee already checked in earlier — friendly heads-up. */
export function alertAlreadyCheckedIn(attendee) {
  const name = escapeHtml(attendee?.fullName || "This attendee");
  return Swal.fire({
    ...base,
    icon: "info",
    iconColor: INK_HEX,
    title: "Already checked in",
    html: `<p class="fl-swal-name">${name}</p><p class="fl-swal-id">${escapeHtml(attendee?.registrationId)}</p>`,
    confirmButtonText: "OK",
    timer: 3500,
    timerProgressBar: true,
  });
}

export function alertError(title, text) {
  return Swal.fire({ ...base, icon: "error", title, text, confirmButtonText: "OK" });
}

/** Small corner toast, e.g. "Ticket saved". */
export function toast(title, icon = "success") {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    iconColor: icon === "success" ? ACCENT_HEX : undefined,
    title,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
}

/** Run a save/print action and report the outcome with a toast or an error alert. */
export async function runWithFeedback(action, successMessage, failTitle) {
  try {
    await action();
    if (successMessage) toast(successMessage);
  } catch (err) {
    alertError(failTitle, err?.message || "Please try again.");
  }
}
