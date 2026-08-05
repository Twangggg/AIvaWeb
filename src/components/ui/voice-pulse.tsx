"use client";

interface VoicePulseProps {
  className?: string;
}

export function VoicePulse({ className = "" }: VoicePulseProps) {
  return (
    <div className={`voice-pulse-stage pointer-events-none ${className}`} aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="voice-pulse-ring"
          style={{ animationDelay: `${i * 0.9}s` }}
        />
      ))}
      <span className="voice-pulse-core" />
    </div>
  );
}
