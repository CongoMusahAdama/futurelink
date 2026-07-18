import { ghanaHubsEvent } from "../data/events";

const SIZES = {
  sm: "h-12",
  md: "h-16",
  lg: "h-20",
  xl: "h-24",
};

export default function EventLogo({ size = "lg", className = "", variant = "default" }) {
  const img = (
    <img
      src={ghanaHubsEvent.logo}
      alt="Ghana Hubs Network"
      className={`${SIZES[size] || SIZES.lg} w-auto max-w-[280px] object-contain object-left`}
    />
  );

  if (variant === "light") {
    return (
      <div className={`inline-flex rounded-xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-white/20 ${className}`}>
        {img}
      </div>
    );
  }

  return <div className={`inline-flex items-center ${className}`}>{img}</div>;
}
