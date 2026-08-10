"use client";

interface ScrollCueProps {
  label: string;
}

/** Mouse + arrow cue at the bottom of the hero — infracorp.global pattern. */
export function ScrollCue({ label }: ScrollCueProps) {
  return (
    <button
      type="button"
      className="scroll-cue"
      aria-label={label}
      onClick={() => {
        const next = document.querySelector("main section:nth-of-type(2)");
        next?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      <span className="scroll-cue-mouse" aria-hidden>
        <span className="scroll-cue-wheel" />
      </span>
      <span className="scroll-cue-label">{label}</span>
    </button>
  );
}
