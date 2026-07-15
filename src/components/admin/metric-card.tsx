import { cn } from "@/lib/cn";

export function MetricCard({
  label,
  value,
  helper,
  tone = "light"
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-md border p-5 shadow-sm",
        tone === "dark" ? "border-gold/30 bg-ink text-pearl" : "border-champagne bg-white text-ink"
      )}
    >
      <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", tone === "dark" ? "text-gold" : "text-smoke")}>{label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
      {helper ? <p className={cn("mt-2 text-sm", tone === "dark" ? "text-pearl/65" : "text-smoke")}>{helper}</p> : null}
    </div>
  );
}
