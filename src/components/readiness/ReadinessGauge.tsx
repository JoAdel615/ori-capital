/**
 * Semi-circle gauge for Funding Readiness Index™ score.
 * Needle sweeps to score (800ms) unless prefers-reduced-motion.
 * 180° arc (bottom semicircle): 0 = left, 100 = right; needle angle = 180(score/100 - 1) so 0→-180°, 100→0°.
 */

import { useEffect, useRef, useState } from "react";

interface ReadinessGaugeProps {
  score: number;
  className?: string;
}

const RADIUS = 80;
const CX = 100;
const CY = 100;

export function ReadinessGauge({ score, className = "" }: ReadinessGaugeProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [displayScore, setDisplayScore] = useState(reducedMotion ? score : 0);
  const mounted = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayScore(score);
      return;
    }
    if (!mounted.current) {
      mounted.current = true;
      const t = setTimeout(() => setDisplayScore(score), 50);
      return () => clearTimeout(t);
    }
    setDisplayScore(score);
  }, [score, reducedMotion]);

  // 180° bottom arc: 0 = left (-180°), 100 = right (0°); needle aligns with score along arc
  const angle = 180 * (displayScore / 100 - 1);
  const needleLength = RADIUS - 12;

  return (
    <div
      className={`relative inline-flex flex-col items-center ${className}`}
      role="img"
      aria-label={`Readiness score ${Math.round(score)} out of 100`}
    >
      <p className="text-2xl font-bold tabular-nums text-ori-foreground mb-1">
        {Math.round(displayScore)}
      </p>
      <svg
        viewBox="0 0 200 120"
        className="w-full max-w-[280px] h-auto"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="gauge-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-ori-border)" stopOpacity="0.6" />
            <stop offset="35%" stopColor="var(--color-ori-muted)" stopOpacity="0.5" />
            <stop offset="65%" stopColor="var(--color-ori-accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-ori-accent)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d={`M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`}
          fill="none"
          stroke="url(#gauge-fill)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Needle: from center toward angle */}
        <g
          transform={`translate(${CX}, ${CY}) rotate(${angle})`}
          style={{
            transition: reducedMotion ? "none" : "transform 800ms cubic-bezier(0.33, 1, 0.68, 1)",
          }}
        >
          <line
            x1={0}
            y1={0}
            x2={needleLength}
            y2={0}
            stroke="var(--color-ori-foreground)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx={0} cy={0} r={6} fill="var(--color-ori-charcoal)" stroke="var(--color-ori-foreground)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
