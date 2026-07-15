"use client";

import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { apiFetch } from "@/lib/client-api";

export function AdminLoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setMessage("");
    try {
      await apiFetch("/api/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: String(form.get("email")),
          password: String(form.get("password"))
        })
      });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-md border border-gold/30 bg-pearl p-6 shadow-premium">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ink font-display text-xl text-gold">K</span>
        <div>
          <p className="font-display text-3xl text-ink">KanchKart</p>
          <p className="text-sm text-smoke">Admin portal</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        <Field name="email" label="Admin email" type="email" required />
        <Field name="password" label="Password" type="password" required />
      </div>
      {message ? <p className="mt-4 text-sm text-smoke">{message}</p> : null}
      <Button className="mt-6 w-full">
        <LogIn size={18} /> Login
      </Button>
    </form>
  );
}
