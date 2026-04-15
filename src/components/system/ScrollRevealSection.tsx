import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

function motionReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Fade/slide-in when the section enters the viewport. If already visible on mount,
 * shows immediately (avoids a below-the-fold flash). Respects `prefers-reduced-motion`.
 */
export function ScrollRevealSection({
  children,
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"section">) {
  const ref = useRef<ElementRef<"section">>(null);
  const [visible, setVisible] = useState(() => motionReduced());

  useLayoutEffect(() => {
    if (motionReduced()) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const mostlyVisible = rect.top < vh * 0.9 && rect.bottom > vh * 0.06;
    if (mostlyVisible) setVisible(true);
  }, []);

  useEffect(() => {
    if (motionReduced() || visible) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  const motionClass = motionReduced()
    ? ""
    : visible
      ? "motion-safe:opacity-100 motion-safe:translate-y-0"
      : "motion-safe:opacity-0 motion-safe:translate-y-5";

  return (
    <section
      ref={ref}
      className={`motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out ${motionClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </section>
  );
}
