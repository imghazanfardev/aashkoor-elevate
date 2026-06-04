import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitContact } from "@/lib/forms.functions";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Section";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AASHKOOR" },
      { name: "description", content: "Get in touch with the AASHKOOR team — sales, support and partnerships." },
      { property: "og:title", content: "Contact AASHKOOR" },
      { property: "og:description", content: "We'd love to hear from you." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useServerFn(submitContact);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [busy, setBusy] = useState(false);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    try {
      setBusy(true);
      await submit({ data: form });
      toast.success("Message sent — we'll respond within 1 business day.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <section className="container-prose pb-12 pt-20 md:pt-28">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="display-hero mt-5 max-w-3xl text-balance">
            Let's start the conversation.
          </h1>
        </Reveal>
      </section>

      <section className="container-prose grid gap-12 pb-32 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <ul className="space-y-7 text-foreground/85">
            <li>
              <p className="eyebrow">Headquarters</p>
              <p className="mt-3 flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-primary" /> Global Industrial HQ</p>
            </li>
            <li>
              <p className="eyebrow">Phone</p>
              <p className="mt-3 flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 text-primary" /> +000 000 0000</p>
            </li>
            <li>
              <p className="eyebrow">Email</p>
              <p className="mt-3 flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 text-primary" /> hello@aashkoor.com</p>
            </li>
            <li>
              <p className="eyebrow">Working hours</p>
              <p className="mt-3 text-sm text-muted-foreground">Sunday – Thursday · 9:00 – 18:00</p>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={onSubmit}
            className="grid gap-5 rounded-3xl bg-card p-8 shadow-[var(--shadow-soft)] md:p-10"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Name *" value={form.name} onChange={update("name")} />
              <Field label="Email *" type="email" value={form.email} onChange={update("email")} />
              <Field label="Phone" value={form.phone} onChange={update("phone")} />
              <Field label="Subject" value={form.subject} onChange={update("subject")} />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground/80">Message *</span>
              <textarea
                rows={6}
                value={form.message}
                onChange={update("message")}
                required
                minLength={5}
                className="rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="btn-primary btn-primary-hover mt-2 self-start disabled:opacity-50"
            >
              {busy ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
            </button>
          </form>
        </Reveal>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={label.includes("*")}
        className="rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );
}
