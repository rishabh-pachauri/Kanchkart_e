"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
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

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("kanchkart_cart") ?? "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("kanchkart_cart", JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("kanchkart-cart"));
  }, [items]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(subtotal + shipping - discount, 0);

  function setQuantity(id: string, quantity: number) {
    setItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  async function applyCoupon() {
    setMessage("");
    try {
      const payload = await apiFetch<{ data: { discount: number; code: string } }>("/api/coupons/apply", {
        method: "POST",
        body: JSON.stringify({ code: coupon, subtotal })
      });
      setDiscount(payload.data.discount);
      setMessage(`${payload.data.code} applied.`);
    } catch (error) {
      setDiscount(0);
      setMessage(error instanceof Error ? error.message : "Coupon failed");
    }
  }

  if (!items.length) {
    return (
      <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-16 text-center">
        <div>
          <ShoppingBag className="mx-auto text-gold" size={42} />
          <h1 className="mt-4 font-display text-5xl text-ink">Your cart is waiting</h1>
          <p className="mt-4 text-smoke">Add premium glassware pieces to begin your KanchKart order.</p>
          <ButtonLink href="/shop" className="mt-6">Shop glassware</ButtonLink>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-ink">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-md border border-champagne bg-pearl p-4 shadow-sm sm:grid-cols-[112px_1fr_auto]">
              <img src={item.image} alt={item.name} className="h-28 w-28 rounded-md object-cover" />
              <div>
                <Link href={`/products/${item.slug}`} className="font-display text-2xl text-ink hover:text-gold">{item.name}</Link>
                <p className="mt-1 text-sm text-smoke">{formatMoney(item.price)}</p>
                <div className="mt-4 inline-flex items-center rounded-md border border-champagne bg-white">
                  <button aria-label="Decrease quantity" className="p-2" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                  <button aria-label="Increase quantity" className="p-2" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                type="button"
                aria-label="Remove product"
                className="luxury-focus self-start rounded-md p-2 text-smoke hover:bg-champagne/50 hover:text-ink"
                onClick={() => setItems((current) => current.filter((cartItem) => cartItem.id !== item.id))}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-md border border-gold/30 bg-white p-5 shadow-premium">
          <p className="font-display text-3xl text-ink">Order Summary</p>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping estimate</span><span>{shipping ? formatMoney(shipping) : "Complimentary"}</span></div>
            <div className="flex justify-between"><span>Coupon</span><span>-{formatMoney(discount)}</span></div>
            <div className="border-t border-champagne pt-3 text-base font-semibold flex justify-between">
              <span>Total</span><span>{formatMoney(total)}</span>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <input
              value={coupon}
              onChange={(event) => setCoupon(event.target.value.toUpperCase())}
              placeholder="Coupon code"
              className="luxury-focus h-11 min-w-0 flex-1 rounded-md border border-champagne px-3 text-sm"
            />
            <Button type="button" variant="secondary" onClick={applyCoupon}>Apply</Button>
          </div>
          {message ? <p className="mt-3 text-sm text-smoke">{message}</p> : null}
          <ButtonLink href="/checkout" className="mt-6 w-full">Checkout</ButtonLink>
        </aside>
      </div>
    </main>
  );
}
