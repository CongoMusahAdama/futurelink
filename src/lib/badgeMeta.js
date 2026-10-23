import { BRAND_NAME, LOGO_SRC, CONTACT_EMAIL, CONTACT_PHONES_DISPLAY } from "./brand";
import { CATEGORIES, EVENT } from "../data/checkin";

/** Name badge print spec: 3.5" × 5.5" vertical + 0.125" bleed */
export const BADGE_SPEC = {
  trimWidthIn: 3.5,
  trimHeightIn: 5.5,
  bleedIn: 0.125,
  safeIn: 0.25,
};

export const BADGE_ORG = {
  organizationName: EVENT.organizer || BRAND_NAME,
  orgLogo: EVENT.organizerLogo || LOGO_SRC,
  partnerLogo: EVENT.partnerLogo || "",
  brandLogo: LOGO_SRC,
  brandName: BRAND_NAME,
  eventTitle: EVENT.title.toUpperCase(),
  eventSubtitle: EVENT.host,
  themeLabel: "THEME:",
  themeQuote: EVENT.theme,
  phones: EVENT.contact ? EVENT.contact.phones : CONTACT_PHONES_DISPLAY,
  website: EVENT.contact?.website || "www.future-linkservices.com",
  email: EVENT.contact?.email || CONTACT_EMAIL,
  poweredBy: BRAND_NAME,
};

export const BADGE_ROLES = [...CATEGORIES, "VIP"];

/** Role pill colors for print & preview */
export const ROLE_COLORS = {
  Guest: { fill: [26, 251, 151], text: [0, 29, 74] },
  Participant: { fill: [236, 72, 153], text: [255, 255, 255] },
  "Medical Staff": { fill: [0, 29, 74], text: [255, 255, 255] },
  Volunteer: { fill: [26, 251, 151], text: [0, 29, 74] },
  Staff: { fill: [0, 29, 74], text: [255, 255, 255] },
  Speaker: { fill: [249, 115, 22], text: [0, 29, 74] },
  Partner: { fill: [26, 251, 151], text: [0, 29, 74] },
  Media: { fill: [147, 197, 253], text: [0, 29, 74] },
  VIP: { fill: [249, 115, 22], text: [0, 29, 74] },
};

export function getRoleColors(role) {
  const match = BADGE_ROLES.find((r) => r.toUpperCase() === String(role || "").toUpperCase());
  return ROLE_COLORS[match || "Guest"];
}

export function getBadgeFields(attendee) {
  return {
    ...BADGE_ORG,
    fullName: (attendee?.fullName || "Attendee Name").toUpperCase(),
    role: (attendee?.category || "Guest").toUpperCase(),
    registrationId: attendee?.registrationId || "",
    organisation: attendee?.organisation || "",
  };
}
