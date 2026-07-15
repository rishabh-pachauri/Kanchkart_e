"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/client-api";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await apiFetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      setMessage("You are on the list.");
      setEmail("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={subscribe} className="mt-6 flex flex-col gap-3 sm:flex-row">
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        type="email"
        required
        placeholder="you@example.com"
        className="luxury-focus h-12 flex-1 rounded-md border border-gold/40 bg-pearl px-4 text-sm text-ink"
      />
      <Button disabled={loading} className="h-12">
        <Send size={17} /> Join
      </Button>
      {message ? <p className="self-center text-sm text-smoke">{message}</p> : null}
    </form>
  );
}
