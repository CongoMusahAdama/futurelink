import SectionHeading from "./SectionHeading";

const stations = [
  {
    name: "Fast Lane",
    tablets: "2 tablets",
    description: "Pre-registered attendees with QR codes. Scan, confirm, print badge in seconds.",
  },
  {
    name: "Help Desk",
    tablets: "1 tablet",
    description: "Walk-ins, name corrections, forgotten registrations, and payment issues.",
  },
  {
    name: "VIP Desk",
    tablets: "1 tablet",
    description: "Dedicated lane for speakers, sponsors, government officials, and executives.",
  },
];

const steps = [
  {
    step: "01",
    title: "Before Arrival",
    items: [
      "Attendees receive a QR code via email or WhatsApp",
      "Encouraged to have it ready on their phone",
    ],
  },
  {
    step: "02",
    title: "At the Venue",
    items: [
      "Professional registration desk with clear branding",
      "Three-station layout for efficient throughput",
    ],
  },
  {
    step: "03",
    title: "Check-in Complete",
    items: [
      "Optional photo capture and badge printing",
      "Organizers see live updates on the dashboard",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-blue-100 bg-blue-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          label="Registration Flow"
          title="Three Stations. One Seamless Experience."
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-blue-100 sm:grid-cols-3">
          {stations.map((station) => (
            <div key={station.name} className="bg-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy">{station.name}</h3>
                <span className="text-xs text-slate-400">{station.tablets}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{station.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((phase) => (
            <div key={phase.step} className="rounded-xl border border-blue-100 bg-white p-6">
              <span className="text-xs font-medium text-brand-blue">{phase.step}</span>
              <h3 className="mt-2 text-sm font-bold text-navy">{phase.title}</h3>
              <ul className="mt-4 space-y-2">
                {phase.items.map((item) => (
                  <li key={item} className="text-sm text-slate-500">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
