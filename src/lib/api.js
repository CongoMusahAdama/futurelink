/** API base — `/api` in dev (Vite proxy), full URL on Netlify (VITE_API_URL) */
export const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export function apiUrl(path = "") {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${suffix}`;
}

async function request(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const fallback =
      res.status === 404
        ? "Phone check unavailable — restart the backend server (npm run dev in backend/)."
        : `Request failed (${res.status})`;
    throw new Error(data.error || fallback);
  }
  return data;
}

export const api = {
  getStats: () => request("/attendees/stats"),
  listAttendees: () => request("/attendees"),
  lookup: (registrationId) => request(`/attendees/lookup/${encodeURIComponent(registrationId)}`),
  checkPhone: (phone) =>
    request(`/attendees/phone-check?phone=${encodeURIComponent(phone)}`),
  createAttendee: (body) =>
    request("/attendees", { method: "POST", body: JSON.stringify(body) }),
  checkIn: (id, checkInStation) =>
    request(`/attendees/${id}/checkin`, {
      method: "PATCH",
      body: JSON.stringify({ checkInStation }),
    }),
  exportUrl: () => apiUrl("/attendees/export"),
};
