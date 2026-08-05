"use client";

interface AmbientBgProps {
  variant?: "hero" | "section" | "cta";
  className?: string;
}

export function AmbientBg({ variant = "section", className = "" }: AmbientBgProps) {
  if (variant === "hero") {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="orb orb-1 opacity-80" />
        <div className="orb orb-2 opacity-60" />
      </div>
    );
  }

  if (variant === "cta") {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--ocean)]/5 to-transparent" />
      </div>
    );
  }

  return null;
}
