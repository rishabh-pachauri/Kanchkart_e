"use client";

import { CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { apiFetch } from "@/lib/client-api";
import { formatMoney } from "@/lib/format";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
};

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("kanchkart_cart") ?? "[]"));
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 99;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const address = {
      fullName: String(form.get("fullName")),
      phone: String(form.get("phone")),
      line1: String(form.get("line1")),
      line2: String(form.get("line2") ?? ""),
      city: String(form.get("city")),
      state: String(form.get("state")),
      postalCode: String(form.get("postalCode")),
      country: "India"
    };

    try {
      const payload = await apiFetch<{
        data: {
          order: { orderNumber: string; customerEmail: string; grandTotal: number };
          razorpayOrder: { id: string; amount: number; currency: string };
          razorpayKeyId?: string;
        };
      }>("/api/checkout/create", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          customer: {
            name: String(form.get("fullName")),
            email: String(form.get("email")),
            phone: String(form.get("phone"))
          },
          shippingAddress: address,
          couponCode: couponCode || undefined
        })
      });

      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !payload.data.razorpayKeyId || !window.Razorpay) {
        setMessage(`Order ${payload.data.order.orderNumber} created. Razorpay keys are not configured for browser checkout.`);
        return;
      }

      const razorpay = new window.Razorpay({
        key: payload.data.razorpayKeyId,
        amount: payload.data.razorpayOrder.amount,
        currency: payload.data.razorpayOrder.currency,
        name: "KanchKart",
        description: "Premium borosilicate glassware",
        order_id: payload.data.razorpayOrder.id,
        prefill: {
          name: String(form.get("fullName")),
          email: String(form.get("email")),
          contact: String(form.get("phone"))
        },
        theme: { color: "#C9A24A" },
        handler: async (response: Record<string, string>) => {
          await apiFetch("/api/payments/verify", {
            method: "POST",
            body: JSON.stringify(response)
          });
          localStorage.removeItem("kanchkart_cart");
          window.dispatchEvent(new CustomEvent("kanchkart-cart"));
          setItems([]);
          setMessage(`Order ${payload.data.order.orderNumber} confirmed.`);
        }
      });
      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="rounded-md border border-champagne bg-pearl p-5 shadow-sm">
          <h1 className="font-display text-5xl text-ink">Checkout</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field name="fullName" label="Full name" required />
            <Field name="email" label="Email" type="email" required />
            <Field name="phone" label="Phone" required />
            <Field name="postalCode" label="PIN code" required />
            <Field name="line1" label="Address line 1" className="sm:col-span-2" required />
            <Field name="line2" label="Address line 2" className="sm:col-span-2" />
            <Field name="city" label="City" required />
            <Field name="state" label="State" required />
          </div>
          <div className="mt-6 rounded-md border border-gold/30 bg-white p-4 text-sm text-smoke">
            <ShieldCheck className="mb-2 text-gold" size={22} />
            Payments are verified with Razorpay signatures. Address and order data are validated before capture.
          </div>
          {message ? <p className="mt-4 text-sm text-smoke">{message}</p> : null}
          <Button disabled={loading || !items.length} className="mt-6">
            <CreditCard size={18} /> Pay securely
          </Button>
        </form>

        <aside className="h-fit rounded-md border border-gold/30 bg-white p-5 shadow-premium">
          <p className="font-display text-3xl text-ink">Order Review</p>
          <div className="mt-5 grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-smoke">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatMoney(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="Coupon"
              className="luxury-focus h-11 min-w-0 flex-1 rounded-md border border-champagne px-3 text-sm"
            />
          </div>
          <div className="mt-5 grid gap-3 border-t border-champagne pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping ? formatMoney(shipping) : "Complimentary"}</span></div>
            <div className="flex justify-between text-base font-semibold"><span>Payable</span><span>{formatMoney(subtotal + shipping)}</span></div>
          </div>
        </aside>
      </div>
    </main>
  );
}
