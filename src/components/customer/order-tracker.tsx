"use client";

import { PackageCheck, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { apiFetch } from "@/lib/client-api";
import { formatDate } from "@/lib/format";
import { orderStatusCopy, trackingSteps } from "@/lib/orders";

type TrackingOrder = {
  orderNumber: string;
  status: keyof typeof orderStatusCopy;
  trackingNumber?: string | null;
  courierName?: string | null;
  courierUrl?: string | null;
  estimatedDelivery?: string | null;
  trackingUpdates: Array<{
    id: string;
    status: keyof typeof orderStatusCopy;
    message: string;
    location?: string | null;
    createdAt: string;
  }>;
};

export function OrderTracker() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [message, setMessage] = useState("");

  async function track(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setOrder(null);
    try {
      const payload = await apiFetch<{ data: { order: TrackingOrder | null } }>(`/api/tracking/${orderId}`);
      if (!payload.data.order) {
        setMessage("No order found for that ID.");
        return;
      }
      setOrder(payload.data.order);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Tracking failed");
    }
  }

  const activeIndex = order ? trackingSteps.indexOf(order.status) : -1;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-md border border-champagne bg-pearl p-5 shadow-sm">
        <h1 className="font-display text-5xl text-ink">Track Your Order</h1>
        <form onSubmit={track} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Field label="Order ID" value={orderId} onChange={(event) => setOrderId(event.target.value)} required />
          <Button className="self-end">
            <Search size={18} /> Track
          </Button>
        </form>
        {message ? <p className="mt-4 text-sm text-smoke">{message}</p> : null}
      </section>

      {order ? (
        <section className="mt-8 rounded-md border border-gold/30 bg-white p-5 shadow-premium">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">{order.orderNumber}</p>
              <h2 className="mt-2 font-display text-4xl text-ink">{orderStatusCopy[order.status]}</h2>
            </div>
            <div className="text-sm text-smoke">
              <p>Tracking: {order.trackingNumber ?? "Awaiting courier scan"}</p>
              <p>Courier: {order.courierName ?? "KanchKart Fulfilment"}</p>
              <p>ETA: {formatDate(order.estimatedDelivery)}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-7">
            {trackingSteps.map((step, index) => (
              <div key={step} className="relative">
                <div className="flex md:block">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm data-[active=true]:border-gold data-[active=true]:bg-gold data-[active=true]:text-ink"
                    data-active={index <= activeIndex}
                  >
                    <PackageCheck size={17} />
                  </span>
                  <p className="ml-3 mt-1 text-sm font-semibold md:ml-0 md:mt-3">{orderStatusCopy[step]}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3">
            {order.trackingUpdates.map((update) => (
              <div key={update.id} className="rounded-md border border-champagne bg-ivory p-4">
                <p className="font-semibold text-ink">{orderStatusCopy[update.status]}</p>
                <p className="mt-1 text-sm text-smoke">{update.message}</p>
                <p className="mt-2 text-xs text-smoke">{formatDate(update.createdAt)} {update.location ? `| ${update.location}` : ""}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
