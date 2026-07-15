"use client";

import { Home, LogIn, Package, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { apiFetch } from "@/lib/client-api";
import { formatDate, formatMoney } from "@/lib/format";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  grandTotal: string;
  createdAt: string;
};

export function AccountClient() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [signedIn, setSignedIn] = useState(false);

  async function loadOrders() {
    try {
      const payload = await apiFetch<{ data: { orders: Order[] } }>("/api/orders");
      setOrders(payload.data.orders);
      setSignedIn(true);
    } catch {
      setSignedIn(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("");
    try {
      await apiFetch(mode === "login" ? "/api/auth/login" : "/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: String(form.get("name") ?? ""),
          email: String(form.get("email")),
          phone: String(form.get("phone") ?? ""),
          password: String(form.get("password"))
        })
      });
      setMessage(mode === "login" ? "Welcome back." : "Your account is ready.");
      await loadOrders();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Account request failed");
    }
  }

  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch("/api/account/addresses", {
        method: "POST",
        body: JSON.stringify({
          fullName: String(form.get("fullName")),
          phone: String(form.get("phone")),
          line1: String(form.get("line1")),
          city: String(form.get("city")),
          state: String(form.get("state")),
          postalCode: String(form.get("postalCode")),
          country: "India"
        })
      });
      setMessage("Address saved.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Address save failed");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <section className="h-fit rounded-md border border-champagne bg-pearl p-5 shadow-sm">
          <div className="inline-flex rounded-md border border-champagne bg-white p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className="rounded-md px-4 py-2 text-sm font-semibold data-[active=true]:bg-ink data-[active=true]:text-pearl"
              data-active={mode === "login"}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className="rounded-md px-4 py-2 text-sm font-semibold data-[active=true]:bg-ink data-[active=true]:text-pearl"
              data-active={mode === "register"}
            >
              Register
            </button>
          </div>
          <h1 className="mt-6 font-display text-5xl text-ink">Customer Account</h1>
          <form onSubmit={submit} className="mt-6 grid gap-4">
            {mode === "register" ? <Field name="name" label="Name" required /> : null}
            <Field name="email" label="Email" type="email" required />
            {mode === "register" ? <Field name="phone" label="Phone" /> : null}
            <Field name="password" label="Password" type="password" required />
            <Button>
              {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
              {mode === "login" ? "Login" : "Create account"}
            </Button>
          </form>
          {message ? <p className="mt-4 text-sm text-smoke">{message}</p> : null}
          <button type="button" className="mt-4 text-sm font-semibold text-gold">Forgot password</button>
        </section>

        <div className="grid gap-6">
          <section className="rounded-md border border-champagne bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold">
              <Package size={18} /> Order History
            </div>
            <div className="mt-5 grid gap-3">
              {signedIn && orders.length ? (
                orders.map((order) => (
                  <div key={order.id} className="grid gap-2 rounded-md border border-champagne p-4 sm:grid-cols-4">
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-smoke">{formatDate(order.createdAt)}</p>
                    <p className="text-sm text-smoke">{order.status.replaceAll("_", " ")}</p>
                    <a className="text-sm font-semibold text-gold" href={`/api/orders/${order.id}/invoice`}>
                      {formatMoney(order.grandTotal)}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-sm text-smoke">Orders appear here after sign-in.</p>
              )}
            </div>
          </section>

          <section className="rounded-md border border-champagne bg-pearl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold">
              <Home size={18} /> Address Book
            </div>
            <form onSubmit={saveAddress} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field name="fullName" label="Full name" required />
              <Field name="phone" label="Phone" required />
              <Field name="line1" label="Address" className="sm:col-span-2" required />
              <Field name="city" label="City" required />
              <Field name="state" label="State" required />
              <Field name="postalCode" label="PIN code" required />
              <div className="flex items-end">
                <Button variant="secondary">Save address</Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
