import { cn } from "@/lib/cn";

export function Field({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-smoke">{label}</span>
      <input
        className="luxury-focus h-11 w-full rounded-md border border-champagne bg-pearl px-3 text-sm text-ink shadow-sm transition placeholder:text-smoke/70 focus:border-gold"
        {...props}
      />
    </label>
  );
}

export function TextArea({
  label,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-smoke">{label}</span>
      <textarea
        className="luxury-focus min-h-32 w-full rounded-md border border-champagne bg-pearl px-3 py-3 text-sm text-ink shadow-sm transition placeholder:text-smoke/70 focus:border-gold"
        {...props}
      />
    </label>
  );
}
