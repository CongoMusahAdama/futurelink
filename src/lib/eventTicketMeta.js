import { BRAND_NAME, LOGO_SRC } from "./brand";

export const TICKET_EVENT = {
  badge: "EVENT",
  title: "FUTURE-LINK EVENT",
  subtitle: "Smart Event Check-In",
  date: "TBA",
  time: "9:00 AM",
  location: "Ghana",
  hall: "Main Hall",
  eventLogo: LOGO_SRC,
  brandLogo: LOGO_SRC,
  brandName: BRAND_NAME,
};

export function formatTicketDate(dateStr) {
  const match = String(dateStr || "").match(/(\d{1,2}\s+\w{3})/);
  return match ? match[1] : dateStr;
}

export function getTicketFields(attendee) {
  const fields = {
    ...TICKET_EVENT,
    registrationId: attendee.registrationId,
    fullName: attendee.fullName || "Attendee",
    category: attendee.category || "Guest",
    region: attendee.region || "—",
    hub: attendee.hub || "—",
    organisation: attendee.organisation || "",
  };
  return {
    ...fields,
    shortDate: formatTicketDate(fields.date),
    city: fields.location.split(",")[0]?.trim() || fields.location,
  };
}
