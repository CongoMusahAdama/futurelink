const API = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
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
  exportUrl: () => `${API}/attendees/export`,
};
