import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 outline-none transition-colors focus:border-yellow";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className || ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} resize-none ${props.className || ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} ${props.className || ""}`} />;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: "bg-yellow text-bg hover:bg-yellow/90 font-semibold",
    secondary: "bg-surface-2 text-ink border border-border hover:bg-surface-2/70",
    danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
    ghost: "text-ink-muted hover:text-ink hover:bg-surface-2",
  };
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface p-5 ${className}`}>{children}</div>
  );
}

const badgeColors: Record<string, string> = {
  todo: "bg-surface-2 text-ink-muted border-border",
  planned: "bg-surface-2 text-ink-muted border-border",
  to_study: "bg-surface-2 text-ink-muted border-border",
  in_progress: "bg-yellow-soft text-yellow border-yellow/30",
  studying: "bg-yellow-soft text-yellow border-yellow/30",
  done: "bg-success/10 text-success border-success/30",
  completed: "bg-success/10 text-success border-success/30",
  low: "bg-surface-2 text-ink-muted border-border",
  medium: "bg-yellow-soft text-yellow border-yellow/30",
  high: "bg-danger/10 text-danger border-danger/30",
};

export function Badge({ value, label }: { value: string; label?: string }) {
  const cls = badgeColors[value] || "bg-surface-2 text-ink-muted border-border";
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {(label || value).replace(/_/g, " ")}
    </span>
  );
}

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {subtitle && <p className="mt-1 max-w-xs text-sm text-ink-muted">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
