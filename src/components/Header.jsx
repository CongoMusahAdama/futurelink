import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { label: "Home", href: "#", hasDropdown: true },
  { label: "Events", href: "#events" },
  { label: "Services", href: "#services" },
  { label: "Impact", href: "#impact" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solidNav = scrolled || open;

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solidNav ? "site-header-scrolled" : ""
      } ${
        solidNav
          ? "border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 transition-all duration-300 sm:px-5 ${
          scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4 lg:py-5"
        }`}
      >
        <Logo
          href="#"
          size={scrolled ? "scrolled" : "landing"}
          className="site-header-logo shrink-0"
        />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-sm text-slate-600 transition-colors hover:text-brand-blue"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
            </a>
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <a
            href="#contact"
            className={`inline-flex items-center gap-2 bg-brand-blue text-sm font-medium text-navy transition-all duration-300 hover:bg-brand-blue-dark ${
              scrolled ? "px-4 py-2" : "px-5 py-2.5"
            }`}
          >
            Contact
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          className="relative z-30 -mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-navy transition-colors hover:bg-blue-50 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-nav" className="relative z-20 border-t border-blue-100 bg-white px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-600 hover:text-brand-blue"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-brand-blue px-4 py-3 text-sm font-medium text-navy"
              onClick={() => setOpen(false)}
            >
              Contact
              <ArrowRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
