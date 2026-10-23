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

/**
 * Desk flow: the main button (and the timer) moves on to the next attendee;
 * "View ticket" (a deny button, so result.isDenied) opens the ticket instead.
 */
function nextOrTicket(nextLabel) {
  return nextLabel
    ? { confirmButtonText: nextLabel, showDenyButton: true, denyButtonText: "View ticket", denyButtonColor: INK_HEX }
    : {};
}

/** Celebrate a successful registration or check-in. */
export function alertCheckedIn(attendee, { isNew = false, nextLabel } = {}) {
  const name = escapeHtml(attendee?.preferredName || attendee?.fullName || "Attendee");
  const id = escapeHtml(attendee?.registrationId);
  return Swal.fire({
    ...base,
    icon: "success",
    iconColor: ACCENT_HEX,
    title: isNew ? "Registered & checked in!" : "Welcome — you're checked in!",
    html: `<p class="fl-swal-name">${name}</p>${id ? `<p class="fl-swal-id">${id}</p>` : ""}`,
    confirmButtonText: "View ticket",
    ...nextOrTicket(nextLabel),
    timer: 3500,
    timerProgressBar: true,
  });
}

/** Attendee already checked in earlier — friendly heads-up. */
export function alertAlreadyCheckedIn(attendee, { nextLabel } = {}) {
  const name = escapeHtml(attendee?.fullName || "This attendee");
  return Swal.fire({
    ...base,
    icon: "info",
    iconColor: INK_HEX,
    title: "Already checked in",
    html: `<p class="fl-swal-name">${name}</p><p class="fl-swal-id">${escapeHtml(attendee?.registrationId)}</p>`,
    confirmButtonText: "OK",
    ...nextOrTicket(nextLabel),
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

/** Yes / no confirmation; resolves true when confirmed. */
export async function confirmAction(title, html, confirmText = "Yes, continue") {
  const result = await Swal.fire({
    ...base,
    icon: "question",
    iconColor: INK_HEX,
    title,
    html,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });
  return result.isConfirmed;
}

export function alertSuccess(title, text) {
  return Swal.fire({ ...base, icon: "success", iconColor: ACCENT_HEX, title, text, confirmButtonText: "OK" });
}
