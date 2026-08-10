import type { ReactNode } from "react";

interface SectionHeaderProps {
  /** @deprecated Unused — pill tags removed from the design. */
  tag?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}

export function SectionHeader({ title, description, align = "center" }: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "text-center" : "text-left"}>
      <h2 className="font-display text-3xl md:text-4xl font-bold leading-snug mb-4">
        {title}
      </h2>
      {description && (
        <p
          className={`text-base md:text-lg max-w-2xl leading-relaxed ${isCenter ? "mx-auto" : ""}`}
          style={{ color: "var(--text-dim)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
