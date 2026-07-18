import { LOGO_SRC, BRAND_NAME } from "../lib/brand";

/** Height + width — TRANS.png has wide transparent margins; width + scale on `landing` */
const SIZES = {
  sm: "h-12 w-[140px] sm:h-14 sm:w-[160px]",
  md: "h-14 w-[160px] sm:h-16 sm:w-[190px]",
  lg: "h-16 w-[190px] sm:h-[4.5rem] sm:w-[230px]",
  xl: "h-[4.5rem] w-[240px] sm:h-20 sm:w-[280px]",
  "2xl": "h-20 w-[280px] sm:h-24 sm:w-[340px]",
  nav: "h-[4.5rem] w-[220px] sm:h-20 sm:w-[260px] md:h-24 md:w-[300px] lg:h-28 lg:w-[340px]",
  /** Landing page header — extra large + scale for transparent PNG padding */
  landing:
    "h-[5.5rem] w-[min(78vw,300px)] sm:h-[7rem] sm:w-[380px] md:h-[8rem] md:w-[440px] lg:h-[9rem] lg:w-[500px] origin-left scale-[1.35] sm:scale-[1.4] md:scale-[1.45] lg:scale-[1.5]",
  /** Compact sticky header after scroll — no scale */
  scrolled: "h-10 w-[140px] sm:h-11 sm:w-[175px] md:h-12 md:w-[210px] lg:h-[3.25rem] lg:w-[250px]",
  hero: "h-[4.5rem] w-[240px] sm:h-24 sm:w-[300px] lg:h-28 lg:w-[360px]",
  /** Ops sidebar — transparent on navy */
  sidebar: "h-11 w-auto max-w-[200px] sm:h-12 sm:max-w-[220px]",
};

/** Icon-only clip — TRANS.png wordmark sits to the right of the mint mark */
const MARK_SIZES = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14 sm:h-16 sm:w-16",
  xl: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
  nav: "h-14 w-14 sm:h-16 sm:w-16",
  landing: "h-16 w-16 sm:h-20 sm:w-20",
};

export default function Logo({
  variant = "default",
  size = "md",
  className = "",
  href,
  markOnly = false,
}) {
  const dimensions = SIZES[size] || SIZES.md;
  const markBox = MARK_SIZES[size] || MARK_SIZES.md;

  const img = markOnly ? (
    <span className={`logo-mark inline-flex shrink-0 overflow-hidden ${markBox} ${className}`}>
      <img
        src={LOGO_SRC}
        alt={BRAND_NAME}
        className="h-full w-auto max-w-none object-contain object-left"
        decoding="async"
      />
    </span>
  ) : variant === "sidebar" ? (
    <img
      src={LOGO_SRC}
      alt={BRAND_NAME}
      className={`logo-sidebar-trans ${SIZES.sidebar} object-contain object-left ${className}`}
      decoding="async"
    />
  ) : (
    <img
      src={LOGO_SRC}
      alt={BRAND_NAME}
      className={`${dimensions} object-contain object-left ${className}`}
      decoding="async"
    />
  );

  const inner =
    variant === "light" && !markOnly ? (
      <span className="inline-flex rounded-xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-white/20 sm:px-4 sm:py-3">
        {img}
      </span>
    ) : (
      img
    );

  const content = markOnly ? (
    inner
  ) : (
    <div className={`inline-flex items-center ${className}`}>{inner}</div>
  );

  if (href) {
    return (
      <a href={href} className="rounded-lg transition-opacity hover:opacity-90">
        {content}
      </a>
    );
  }

  return content;
}
