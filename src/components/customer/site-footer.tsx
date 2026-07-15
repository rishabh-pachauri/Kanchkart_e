"use client";

import Link from "next/link";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-champagne bg-ink text-pearl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-3xl text-gold">KanchKart</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-pearl/75">
            Premium borosilicate glassware and glass storage designed for beautiful kitchens, clean rituals, and gifting that lasts.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">Explore</p>
          <div className="mt-4 grid gap-3 text-sm text-pearl/75">
            <Link href="/shop" className="hover:text-gold">Shop all</Link>
            <Link href="/orders/track" className="hover:text-gold">Track order</Link>
            <Link href="/account" className="hover:text-gold">My account</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">Support</p>
          <div className="mt-4 grid gap-3 text-sm text-pearl/75">
            <a href="mailto:care@kanchkart.com" className="inline-flex items-center gap-2 hover:text-gold">
              <Mail size={16} /> care@kanchkart.com
            </a>
            <a href="https://wa.me/919999999999" className="inline-flex items-center gap-2 hover:text-gold">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href="https://instagram.com/kanchkart" className="inline-flex items-center gap-2 hover:text-gold">
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-pearl/10 px-4 py-5 text-center text-xs text-pearl/55">
        © {new Date().getFullYear()} KanchKart. Crafted for kanchkart.com.
      </div>
    </footer>
  );
}
