import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "luxury-focus inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-ink text-pearl hover:bg-gold hover:text-ink",
        variant === "secondary" && "border border-gold/50 bg-pearl text-ink hover:border-gold hover:bg-champagne/60",
        variant === "ghost" && "text-ink hover:bg-champagne/50",
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  className,
  variant = "primary",
  children
}: {
  href: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "luxury-focus inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition duration-200",
        variant === "primary" && "bg-ink text-pearl hover:bg-gold hover:text-ink",
        variant === "secondary" && "border border-gold/50 bg-pearl text-ink hover:border-gold hover:bg-champagne/60",
        variant === "ghost" && "text-ink hover:bg-champagne/50",
        className
      )}
    >
      {children}
    </Link>
  );
}
