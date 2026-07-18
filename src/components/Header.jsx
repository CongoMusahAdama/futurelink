import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "../data/navigation";

function NavDropdown({ link, onNavigate }) {
  if (!link.children?.length) {
    return (
      <a href={link.href} className="nav-top-link" onClick={onNavigate}>
        {link.label}
      </a>
    );
  }

  return (
    <div className="nav-item group">
      <a href={link.href} className="nav-top-link">
        {link.label}
        <ChevronDown className="nav-chevron" aria-hidden="true" />
      </a>

      <div className="nav-dropdown-bridge" aria-hidden="true" />

      <div className="nav-dropdown">
        <ul className="nav-dropdown-list">
          {link.children.map((child) => (
            <li key={child.label}>
              <a href={child.href} className="nav-dropdown-link" onClick={onNavigate}>
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MobileNavGroup({ link, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = link.children?.length > 0;

  if (!hasChildren) {
    return (
      <a href={link.href} className="mobile-nav-link" onClick={onNavigate}>
        {link.label}
      </a>
    );
  }

  return (
    <div className="mobile-nav-group">
      <div className="flex items-center justify-between gap-2">
        <a href={link.href} className="mobile-nav-link flex-1" onClick={onNavigate}>
          {link.label}
        </a>
        <button
          type="button"
          className="mobile-nav-expand"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${link.label} menu`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded && (
        <ul className="mobile-nav-sublist">
          {link.children.map((child) => (
            <li key={child.label}>
              <a href={child.href} className="mobile-nav-sublink" onClick={onNavigate}>
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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
  const closeMobile = () => setOpen(false);

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

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavDropdown key={link.label} link={link} onNavigate={undefined} />
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
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <MobileNavGroup key={link.label} link={link} onNavigate={closeMobile} />
            ))}
            <a
              href="#contact"
              className="mt-2 inline-flex items-center justify-center gap-2 bg-brand-blue px-4 py-3 text-sm font-medium text-navy"
              onClick={closeMobile}
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
