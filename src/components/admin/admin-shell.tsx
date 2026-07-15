"use client";

import Link from "next/link";
import { BarChart3, Boxes, CreditCard, LayoutDashboard, LogOut, PackageCheck, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/client-api";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: PackageCheck },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 }
];

export function AdminShell({ children, adminName }: { children: React.ReactNode; adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST", body: JSON.stringify({}) });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-champagne bg-ink px-4 py-5 text-pearl lg:block">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold font-display text-xl text-ink">K</span>
          <span className="font-display text-2xl">KanchKart</span>
        </Link>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-pearl/45">Admin portal</p>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-pearl/70 transition hover:bg-pearl/10 hover:text-gold",
                pathname === item.href && "bg-pearl/10 text-gold"
              )}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="absolute bottom-5 left-4 right-4 flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-pearl/70 transition hover:bg-pearl/10 hover:text-gold"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-champagne bg-pearl/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">KanchKart Commerce</p>
              <p className="mt-1 text-sm text-smoke">Signed in as {adminName}</p>
            </div>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md border border-champagne bg-white px-3 py-2 text-sm">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
