/** The event currently running on the check-in, dashboard, ticket and badge screens. */
export const EVENT = {
  title: "Free Breast Screening 2026",
  host: "Duapa Werkspace × Sycamore Medical Centre",
  theme: "Take a Step Towards Early Detection",
  city: "Anaji",
  venue: "Duapa Werkspace Premises, Anaji",
  dateLabel: "Fri 23 Oct 2026",
  time: "9:00 AM",
  /** Short codes shown on the ticket route strip, e.g. DWS → BCS */
  codeFrom: "DWS",
  codeTo: "BCS",
  codeToLabel: "Screening",
  /** Event flyer (served from /public), shown on the ticket and check-in home */
  flyer: "/events/breast-screening-flyer.jpg",
  /** Organiser shown on badges and printed tickets */
  organizer: "Duapa Werkspace",
  organizerLogo: "/events/duapa-werkspace-logo.png",
  partnerLogo: "/events/sycamore-medical-logo.png",
  contact: {
    phones: "",
    website: "www.duapawerkspace.com",
    email: "info@duapawerkspace.com",
  },
  /** Ticket colours, taken from the flyer */
  ticketTheme: {
    ink: "#7a0d45",
    accent: "#e0157a",
    accentInk: "#ffffff",
    bg: "#fdf0f6",
  },
  /** Repeating phrases on the lanyard strap */
  lanyardPhrases: ["DUAPA WERKSPACE", "BREAST SCREENING", "EARLY DETECTION"],
  /** Prefix for exported files */
  fileSlug: "breast-screening-2026",
};

export const CATEGORIES = [
  "Participant",
  "Medical Staff",
  "Volunteer",
  "Staff",
  "Partner",
  "Speaker",
  "Media",
  "Guest",
];

/** Categories offered at the VIP / priority desk */
export const VIP_CATEGORIES = ["Medical Staff", "Speaker", "Partner"];

export const REGIONS = [
  "Western",
  "Ashanti",
  "Greater Accra",
  "Northern",
  "Eastern",
  "Central",
  "Volta",
  "Bono",
  "Other",
];
