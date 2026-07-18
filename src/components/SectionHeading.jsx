import ScrollReveal from "./ScrollReveal";

export default function SectionHeading({
  label,
  title,
  description,
  align = "center",
}) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={alignClass}>
      {label && (
        <ScrollReveal as="p" className="text-sm font-medium text-brand-blue">
          {label}
        </ScrollReveal>
      )}
      <ScrollReveal
        as="h2"
        delay={100}
        className="mt-3 text-2xl font-bold text-navy sm:text-3xl"
      >
        {title}
      </ScrollReveal>
      {description && (
        <ScrollReveal
          as="p"
          delay={200}
          className={`mt-4 text-sm text-slate-500 ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {description}
        </ScrollReveal>
      )}
    </div>
  );
}
