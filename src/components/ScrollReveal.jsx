import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "default",
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const variantClass =
    variant === "heading"
      ? "scroll-reveal-heading"
      : variant === "subtle"
        ? "scroll-reveal-subtle"
        : "";

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${variantClass} ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
