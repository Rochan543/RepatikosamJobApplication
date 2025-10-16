import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "Message sent." : "Failed to send.");
    } catch {
      setStatus("Failed to send.");
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">Name</label>
          <input id="name" name="name" className="w-full rounded-md border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="w-full rounded-md border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="message">Message</label>
          <textarea id="message" name="message" className="w-full rounded-md border px-3 py-2 h-32" required />
        </div>
        <Button type="submit">Send</Button>
        {status && <p className="text-sm text-foreground/70">{status}</p>}
      </form>
    </div>
  );
}
