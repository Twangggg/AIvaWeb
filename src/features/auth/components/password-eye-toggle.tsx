"use client";

type Props = {
  show: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
};

export function PasswordEyeToggle({ show, onToggle, showLabel, hideLabel }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#8a7a62] transition hover:bg-black/[0.04] hover:text-[#2a241c]"
      aria-label={show ? hideLabel : showLabel}
    >
      <span className="material-symbols-outlined text-[22px]" aria-hidden>
        {show ? "visibility_off" : "visibility"}
      </span>
    </button>
  );
}
