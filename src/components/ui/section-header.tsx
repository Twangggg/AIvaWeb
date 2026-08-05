import type { ReactNode } from "react";

interface SectionHeaderProps {
  tag?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
}

export function SectionHeader({ tag, title, description, align = "center" }: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "text-center" : "text-left"}>
      {tag && (
        <span className={`section-tag mb-5 ${isCenter ? "inline-flex" : "inline-flex"}`}>
          {tag}
        </span>
      )}
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
