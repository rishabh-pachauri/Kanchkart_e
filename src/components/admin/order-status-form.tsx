"use client";

import { Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { apiFetch } from "@/lib/client-api";
import { orderStatusCopy, trackingSteps } from "@/lib/orders";

export function OrderStatusForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("");
    try {
      await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: String(form.get("status")),
          trackingNumber: String(form.get("trackingNumber") ?? ""),
          courierName: String(form.get("courierName") ?? ""),
          courierUrl: String(form.get("courierUrl") ?? "") || undefined,
          estimatedDelivery: form.get("estimatedDelivery")
            ? new Date(String(form.get("estimatedDelivery"))).toISOString()
            : undefined,
          message: String(form.get("message") ?? "") || undefined
        })
      });
      setMessage("Status updated and notifications queued.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Status update failed");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-md border border-champagne bg-ivory p-4">
      <label>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-smoke">Status</span>
        <select name="status" defaultValue={currentStatus} className="luxury-focus h-11 w-full rounded-md border border-champagne bg-white px-3 text-sm">
          {trackingSteps.map((status) => (
            <option key={status} value={status}>{orderStatusCopy[status]}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="trackingNumber" label="Tracking number" />
        <Field name="courierName" label="Courier" />
        <Field name="courierUrl" label="Courier URL" />
        <Field name="estimatedDelivery" label="ETA" type="date" />
      </div>
      <Field name="message" label="Timeline message" />
      <Button className="w-fit">
        <Truck size={18} /> Update tracking
      </Button>
      {message ? <p className="text-sm text-smoke">{message}</p> : null}
    </form>
  );
}
