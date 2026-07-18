import { LOGO_SRC, BRAND_NAME } from "../lib/brand";

/** Height + width — TRANS.png has wide transparent margins; width helps it read larger */
const SIZES = {
  sm: "h-12 w-[140px] sm:h-14 sm:w-[160px]",
  md: "h-14 w-[160px] sm:h-16 sm:w-[190px]",
  lg: "h-16 w-[190px] sm:h-[4.5rem] sm:w-[230px]",
  xl: "h-[4.5rem] w-[240px] sm:h-20 sm:w-[280px]",
  "2xl": "h-20 w-[280px] sm:h-24 sm:w-[340px]",
  /** Site header — mobile-first, prominent on all breakpoints */
  nav: "h-[3.75rem] w-[200px] min-w-[180px] sm:h-[4.5rem] sm:w-[240px] md:h-20 md:w-[280px] lg:h-[5.25rem] lg:w-[320px]",
  hero: "h-[4.5rem] w-[240px] sm:h-24 sm:w-[300px] lg:h-28 lg:w-[360px]",
};

export default function Logo({ variant = "default", size = "md", className = "", href }) {
  const dimensions = SIZES[size] || SIZES.md;

  const img = (
    <img
      src={LOGO_SRC}
      alt={BRAND_NAME}
      className={`${dimensions} object-contain object-left`}
      decoding="async"
    />
  );

  const inner =
    variant === "light" ? (
      <span className="inline-flex rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-white/20 sm:px-4 sm:py-3">
        {img}
      </span>
    ) : (
      img
    );

  const content = <div className={`inline-flex items-center ${className}`}>{inner}</div>;

  if (href) {
    return (
      <a href={href} className="rounded-lg transition-opacity hover:opacity-90">
        {content}
      </a>
    );
  }

  return content;
}
