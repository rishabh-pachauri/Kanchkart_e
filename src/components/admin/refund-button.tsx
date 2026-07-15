"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/client-api";

export function RefundButton({ paymentId, disabled }: { paymentId: string; disabled?: boolean }) {
  const [message, setMessage] = useState("");

  async function refund() {
    setMessage("");
    try {
      await apiFetch(`/api/admin/payments/${paymentId}/refund`, {
        method: "POST",
        body: JSON.stringify({})
      });
      setMessage("Refund recorded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Refund failed");
    }
  }

  return (
    <div>
      <Button type="button" variant="secondary" className="h-10 px-3" disabled={disabled} onClick={refund}>
        <RotateCcw size={16} /> Refund
      </Button>
      {message ? <p className="mt-2 text-xs text-smoke">{message}</p> : null}
    </div>
  );
}
