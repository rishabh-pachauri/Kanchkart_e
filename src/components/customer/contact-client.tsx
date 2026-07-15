"use client";

import { Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TextArea } from "@/components/ui/field";
import { apiFetch } from "@/lib/client-api";

export function ContactClient() {
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("");
    try {
      await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: String(form.get("name")),
          email: String(form.get("email")),
          phone: String(form.get("phone") ?? ""),
          subject: String(form.get("subject") ?? ""),
          message: String(form.get("message"))
        })
      });
      setMessage("Message received. The KanchKart team will reply shortly.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Message failed");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="rounded-md border border-champagne bg-pearl p-5 shadow-sm">
          <h1 className="font-display text-5xl text-ink">Contact KanchKart</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Name" required />
            <Field name="email" label="Email" type="email" required />
            <Field name="phone" label="Phone" />
            <Field name="subject" label="Subject" />
            <TextArea name="message" label="Message" className="sm:col-span-2" required />
          </div>
          {message ? <p className="mt-4 text-sm text-smoke">{message}</p> : null}
          <Button className="mt-6">
            <Send size={18} /> Send message
          </Button>
        </form>
        <aside className="h-fit rounded-md border border-gold/30 bg-white p-5 shadow-premium">
          <p className="font-display text-3xl text-ink">Care Studio</p>
          <div className="mt-5 grid gap-4 text-sm text-smoke">
            <a href="mailto:care@kanchkart.com" className="flex items-center gap-3 rounded-md border border-champagne p-3 hover:border-gold hover:text-ink">
              <Mail className="text-gold" size={20} /> care@kanchkart.com
            </a>
            <a href="https://wa.me/919999999999" className="flex items-center gap-3 rounded-md border border-champagne p-3 hover:border-gold hover:text-ink">
              <MessageCircle className="text-gold" size={20} /> WhatsApp order support
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}
