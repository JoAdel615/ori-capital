import { useEffect, useRef, useState } from "react";

/**
 * Wraps content and adds a subtle reveal animation when the section scrolls into view.
 * Uses Intersection Observer (no new deps). Use on major sections for a premium feel.
 */
export function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "reveal-section opacity-100" : "opacity-0 translate-y-4"} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
