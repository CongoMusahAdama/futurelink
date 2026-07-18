import { LOGO_SRC, BRAND_NAME } from "../lib/brand";

const SIZES = {
  sm: "h-9",
  md: "h-11",
  lg: "h-16",
  xl: "h-20",
  "2xl": "h-24",
  hero: "h-[4.5rem] sm:h-[5.5rem] lg:h-[6.5rem]",
};

const MAX_WIDTH = {
  sm: "max-w-[200px]",
  md: "max-w-[260px]",
  lg: "max-w-[320px]",
  xl: "max-w-[380px]",
  "2xl": "max-w-[480px]",
  hero: "max-w-[300px] sm:max-w-[380px] lg:max-w-[460px]",
};

export default function Logo({ variant = "default", size = "md", className = "", href }) {
  const height = SIZES[size] || SIZES.md;
  const maxW = MAX_WIDTH[size] || MAX_WIDTH.md;

  const img = (
    <img
      src={LOGO_SRC}
      alt={BRAND_NAME}
      className={`${height} w-auto ${maxW} object-contain object-left`}
    />
  );

  const inner =
    variant === "light" ? (
      <span className="inline-flex rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-white/20">
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
