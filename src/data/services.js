/** Future-Link service catalogue — shared by home preview & dedicated page */

export const servicePillars = [
  {
    id: "skills",
    label: "Skills",
    tagline: "Train for work and income",
    description:
      "Practical programmes that help people become job-ready and turn skills into sustainable earnings.",
  },
  {
    id: "business",
    label: "Business",
    tagline: "Build and grow enterprises",
    description:
      "Hands-on SME support and smart event tools that help organisations run professionally and scale.",
  },
  {
    id: "opportunity",
    label: "Opportunity",
    tagline: "Create lasting community impact",
    description:
      "Community initiatives and vocational pathways that open doors for youth, artisans, and local leaders.",
  },
];

export const services = [
  {
    id: "workforce",
    pillar: "skills",
    title: "Workforce Development",
    summary: "CV coaching, interview prep, and job readiness for Ghana's growing workforce.",
    description:
      "We prepare individuals to compete confidently in today's job market — from first-time applicants to career changers. Our coaches work through CVs, mock interviews, workplace communication, and the soft skills employers expect.",
    image: "/services/workforce-development.jpg",
    items: [
      "CV writing & optimization",
      "Interview coaching",
      "Job readiness training",
      "Soft skills development",
    ],
  },
  {
    id: "skills-income",
    pillar: "skills",
    title: "Skills-to-Income Training",
    summary: "Hands-on vocational training that converts learning into real income streams.",
    description:
      "Participants learn production skills they can use immediately — mushroom farming, soap making, food processing, baking, and more. Every programme is designed around local market demand and small-business startup basics.",
    image: "/services/skills-to-income.jpg",
    items: [
      "Mushroom production training",
      "Soap making (liquid & black soap)",
      "Food processing (spices, juice, yoghurt)",
      "Baking & small business skills",
    ],
  },
  {
    id: "business-support",
    pillar: "business",
    title: "Business Support Services",
    summary: "Structured guidance for SMEs — from setup to pricing, records, and growth.",
    description:
      "Future-Link supports entrepreneurs and small businesses with practical coaching on registration, pricing, marketing, bookkeeping, and day-to-day operations so owners can focus on serving customers and scaling sustainably.",
    image: "/services/business-support.jpg",
    items: [
      "Business setup guidance",
      "Pricing & marketing strategy",
      "Record keeping support",
      "SME coaching",
    ],
  },
  {
    id: "community",
    pillar: "opportunity",
    title: "Community Initiatives",
    summary: "Youth engagement, recycling, and environmental programmes that strengthen communities.",
    description:
      "We partner with communities on waste collection, recycling awareness, youth leadership, and environmental stewardship — creating local jobs while building cleaner, more engaged neighbourhoods across Ghana.",
    image: "/services/community-initiatives.jpg",
    items: [
      "Waste collection & recycling programs",
      "Youth engagement projects",
      "Environmental awareness",
    ],
  },
  {
    id: "checkin",
    pillar: "business",
    title: "Smart Check-In & Analytics Service",
    summary: "Paperless event registration, live dashboards, and post-event intelligence.",
    description:
      "Our event platform powers QR check-in, instant badge printing, live attendance dashboards, and exportable analytics — giving organisers real-time visibility and professional reports when the event ends.",
    image: "/services/event-checkin.jpg",
    items: [
      "QR code & paperless event check-in",
      "Live attendance dashboard",
      "Instant name-tag printing",
      "Custom exports & post-event analytics",
    ],
  },
  {
    id: "builders",
    pillar: "opportunity",
    title: "Builders Academy",
    summary: "Trade skills, safety training, and enterprise support for Ghana's construction sector.",
    description:
      "Builders Academy equips artisans and contractors with practical construction skills, tooling knowledge, site safety, and business fundamentals — helping tradespeople qualify for better work and run their own enterprises.",
    image: "/services/builders-academy.jpg",
    items: [
      "Practical trade & construction skills",
      "Artisan training & certification pathways",
      "Tooling, safety & worksite readiness",
      "Enterprise support for builders & contractors",
    ],
  },
];

export function getPillarLabel(pillarId) {
  return servicePillars.find((pillar) => pillar.id === pillarId)?.label ?? pillarId;
}
