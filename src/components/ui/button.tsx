interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

export function Button({ className, fullWidth, ...props }: ButtonProps) {
  return (
    <button
      className={[
        "rounded-xl border border-brand-gold/80 bg-brand-gold px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em]",
        "shadow-lg shadow-brand-gold/15 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-brand-gold/25",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        fullWidth && "w-full",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ color: "var(--text-on-accent)" }}
      {...props}
    />
  );
}
