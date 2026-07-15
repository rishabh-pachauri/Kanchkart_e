"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/orders/track", label: "Track" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => {
      const items = JSON.parse(localStorage.getItem("kanchkart_cart") ?? "[]") as Array<{ quantity: number }>;
      setCartCount(items.reduce((total, item) => total + item.quantity, 0));
    };
    sync();
    window.addEventListener("kanchkart-cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("kanchkart-cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-champagne/70 bg-pearl/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="luxury-focus flex items-center gap-3 rounded-md">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink font-display text-lg text-gold">
            K
          </span>
          <span className="font-display text-2xl text-ink">KanchKart</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="luxury-focus rounded-md text-sm font-medium text-smoke transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/shop" aria-label="Search products" className="luxury-focus rounded-md p-2 text-ink hover:bg-champagne/50">
            <Search size={20} />
          </Link>
          <Link href="/account" aria-label="Account" className="luxury-focus rounded-md p-2 text-ink hover:bg-champagne/50">
            <UserRound size={20} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="luxury-focus relative rounded-md p-2 text-ink hover:bg-champagne/50"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            className="luxury-focus rounded-md p-2 text-ink hover:bg-champagne/50 md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div className={cn("border-t border-champagne bg-pearl md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="luxury-focus rounded-md px-3 py-3 text-sm font-semibold text-ink hover:bg-champagne/50"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
