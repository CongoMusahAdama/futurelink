import SectionHeading from "./SectionHeading";

const plans = [
  {
    name: "Basic",
    price: "GHS 2,000",
    period: "per event",
    description: "Essential digital registration for smaller events.",
    features: [
      "4 tablets with stands",
      "Secure digital platform",
      "QR code check-in",
      "Basic attendance tracking",
      "Participant database export",
    ],
  },
  {
    name: "Standard",
    price: "GHS 20",
    period: "per person",
    description: "Full setup and support for mid-size conferences.",
    features: [
      "Full setup and on-site support",
      "Fast lane and help desk stations",
      "Instant name-tag printing",
      "Live attendance dashboard",
      "Customizable data exports",
      "Staff training included",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "GHS 5,000",
    period: "per event",
    description: "Comprehensive event intelligence for flagship events.",
    features: [
      "Everything in Standard",
      "VIP registration desk",
      "Real-time analytics dashboard on TV",
      "End-of-day professional report",
      "Regional and org-type breakdowns",
      "Post-event insights and recommendations",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-t border-blue-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          label="Pricing Plan"
          title="Professional Events, Transparent Pricing"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border bg-white p-6 ${
                plan.highlighted ? "border-brand-blue ring-2 ring-brand-blue/20" : "border-blue-100"
              }`}
            >
              {plan.highlighted && (
                <span className="text-xs font-medium uppercase tracking-wide text-brand-blue">
                  Most Popular
                </span>
              )}
              <h3 className="mt-1 text-lg font-bold text-navy">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-navy">{plan.price}</span>
                <span className="text-xs text-slate-400">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-slate-500">{plan.description}</p>

              <ul className="mt-6 space-y-2 border-t border-slate-200 pt-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-slate-500">
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-6 block py-2.5 text-center text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-brand-blue text-navy hover:bg-brand-blue-dark"
                    : "border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-navy"
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
