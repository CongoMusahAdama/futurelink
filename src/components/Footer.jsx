import Logo from "./Logo";
import { CONTACT_ADDRESS, CONTACT_MAP_URL, CONTACT_BANK } from "../lib/brand";

const links = {
  Solutions: ["Event Registration", "Live Dashboard", "Analytics Reports", "On-site Support"],
  Company: ["About", "Case Studies", "Contact"],
  Resources: ["Pricing", "FAQ", "Privacy Policy", "Terms of Service"],
};

export default function Footer() {
  return (
    <footer className="border-t border-navy bg-navy text-white">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo variant="light" size="xl" />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Smooth Entry, Smart Insights. Professional digital registration and event
              intelligence for conferences and workshops across Ghana.
            </p>
            <p className="mt-3 text-xs text-white/50">Smart Event Intelligence</p>
            <a
              href={CONTACT_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-white/50 transition-colors hover:text-white"
            >
              {CONTACT_ADDRESS}
            </a>
            <p className="mt-1 text-xs text-white/50">{CONTACT_BANK}</p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                {title}
              </h4>
              <ul className="mt-4 space-y-2">
                {items.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/50">
            {new Date().getFullYear()} Future-Link Services. All rights reserved.
          </p>
          <p className="text-xs text-white/50">
            Smooth Entry · Smart Insights
          </p>
        </div>
      </div>
    </footer>
  );
}
