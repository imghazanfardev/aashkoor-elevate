import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { useCart } from "@/lib/stores/cart";
import { money } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — AASHKOOR" },
      { name: "description", content: "Submit your order details and our team will prepare a tailored proposal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(3).max(255),
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-prose py-32 text-center">
        <h1 className="display-section">No items to checkout</h1>
        <Link to="/products" className="btn-primary btn-primary-hover mt-8 inline-flex">
          Browse catalogue
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error("Please check the highlighted fields.");
      return;
    }
    setSubmitting(true);
    // Generate a friendly order number locally; backend integration is in Laravel scaffolding.
    const orderNo = `AK-${Date.now().toString().slice(-8)}`;
    await new Promise((r) => setTimeout(r, 600));
    clear();
    setSubmitting(false);
    navigate({ to: "/order-success", search: { order: orderNo } });
  }

  return (
    <div className="container-prose py-16 md:py-20">
      <p className="eyebrow text-primary">Checkout</p>
      <h1 className="display-section mt-3">Confirm your details</h1>

      <form onSubmit={onSubmit} className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8 rounded-2xl border border-foreground/10 bg-card p-6 md:p-8">
          <fieldset className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" name="fullName" required />
            <Field label="Company" name="company" />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" required />
            <Field label="Address" name="address" required className="md:col-span-2" />
            <Field label="Country" name="country" required />
            <Field label="City" name="city" required />
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Notes</label>
              <textarea
                name="notes"
                rows={4}
                maxLength={2000}
                placeholder="Project details, delivery preferences, certifications required..."
                className="mt-2 w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </fieldset>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Your information is sent securely to our sales engineering team.
          </div>
        </div>

        <aside className="rounded-2xl border border-foreground/10 bg-[var(--color-surface)] p-6 md:sticky md:top-28 md:h-fit">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <ul className="mt-5 divide-y divide-foreground/10">
            {items.map((i) => (
              <li key={i.slug} className="flex gap-3 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-background">
                  <img src={i.image} alt={i.name} className="h-full w-full object-contain p-1.5" />
                </div>
                <div className="flex flex-1 items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="line-clamp-1 font-semibold">{i.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
                  </div>
                  <p className="font-semibold">{money(i.price * i.qty)}</p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-foreground/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between border-t border-foreground/10 pt-2">
              <dt className="font-display font-bold">Estimated total</dt>
              <dd className="font-display font-bold">{money(subtotal)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary btn-primary-hover mt-6 w-full justify-center disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Place order"} <ArrowRight className="h-4 w-4" />
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-semibold">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
