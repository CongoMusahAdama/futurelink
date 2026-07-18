import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";

const services = [
  {
    title: "Workforce Development",
    image: "/services/workforce-development.jpg",
    items: [
      "CV writing & optimization",
      "Interview coaching",
      "Job readiness training",
      "Soft skills development",
    ],
  },
  {
    title: "Skills-to-Income Training",
    image: "/services/skills-to-income.jpg",
    items: [
      "Mushroom production training",
      "Soap making (liquid & black soap)",
      "Food processing (spices, juice, yoghurt)",
      "Baking & small business skills",
    ],
  },
  {
    title: "Business Support Services",
    image: "/services/business-support.jpg",
    items: [
      "Business setup guidance",
      "Pricing & marketing strategy",
      "Record keeping support",
      "SME coaching",
    ],
  },
  {
    title: "Community Initiatives",
    image: "/services/community-initiatives.jpg",
    items: [
      "Waste collection & recycling programs",
      "Youth engagement projects",
      "Environmental awareness",
    ],
  },
  {
    title: "Smart Check-In & Analytics Service",
    image: "/events/ghana-hubs-summit.png",
    imageClass: "object-contain object-center p-3 bg-blue-50",
    items: [
      "QR code & paperless event check-in",
      "Live attendance dashboard",
      "Instant name-tag printing",
      "Custom exports & post-event analytics",
    ],
  },
  {
    title: "Builders Academy",
    image: "/services/builders-academy.jpg",
    items: [
      "Practical trade & construction skills",
      "Artisan training & certification pathways",
      "Tooling, safety & worksite readiness",
      "Enterprise support for builders & contractors",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="border-t border-blue-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          label="Our Services"
          title="Skills. Business. Opportunity."
          description="We equip individuals and businesses with the skills, tools, and support needed to grow and succeed — from workforce training and SME coaching to smart event registration."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative h-36 overflow-hidden bg-blue-50">
                <img
                  src={service.image}
                  alt={service.title}
                  className={`h-full w-full ${service.imageClass ?? "object-cover object-center"}`}
                  loading="lazy"
                />
              </div>
              <div className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
                {service.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
