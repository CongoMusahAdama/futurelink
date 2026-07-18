import SectionHeading from "./SectionHeading";

const services = [
  {
    title: "Tablets with Stands",
    description: "Professional on-site registration stations with Infinix XPAD tablets and stands.",
  },
  {
    title: "Full Setup & Support",
    description: "End-to-end event day support from desk setup to staff training and troubleshooting.",
  },
  {
    title: "Fast Paperless Check-in",
    description: "QR code scanning for pre-registered attendees. Check-in in 5 to 10 seconds.",
  },
  {
    title: "Instant Name-Tag Printing",
    description: "Branded badges printed on the spot with preferred names and organisation details.",
  },
  {
    title: "Custom Database Exports",
    description: "Exportable participant data with registration IDs, categories, and contact info.",
  },
  {
    title: "Post-Event Data Analysis",
    description: "Professional analytics reports with insights, trends, and recommendations.",
  },
];

export default function Services() {
  return (
    <section id="services" className="border-t border-blue-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          label="Our Service Offering"
          title="Digital Registration That Works"
          description="Future-Link Services specializes in professional, affordable, and efficient digital registration for conferences, AGMs, and workshops."
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-blue-100 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="bg-white p-6 transition-colors hover:bg-blue-50">
              <h3 className="text-sm font-bold text-navy">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
