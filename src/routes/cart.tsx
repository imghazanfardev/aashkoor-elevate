import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { money } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — AASHKOOR" },
      { name: "description", content: "Review the products in your quote cart and proceed to checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.subtotal());

  if (items.length === 0) {
    return (
      <div className="container-prose flex flex-col items-center py-32 text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h1 className="display-section mt-8">Your cart is empty</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Browse our catalogue and start building a tailored quote for your project.
        </p>
        <Link to="/products" className="btn-primary btn-primary-hover mt-8">
          Browse catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="container-prose py-16 md:py-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-primary">Cart</p>
          <h1 className="display-section mt-3">Review your items</h1>
        </div>
        <button
          onClick={clear}
          className="text-sm text-muted-foreground hover:text-destructive"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card">
          {items.map((i) => (
            <li key={i.slug} className="flex gap-5 p-5 md:p-6">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface)]">
                <img src={i.image} alt={i.name} className="h-full w-full object-contain p-3" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-primary">{i.category}</p>
                    <Link
                      to="/products/$slug"
                      params={{ slug: i.slug }}
                      className="mt-1 block font-display text-lg font-bold hover:text-primary"
                    >
                      {i.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">{money(i.price)} each</p>
                  </div>
                  <button
                    onClick={() => remove(i.slug)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-end justify-between pt-4">
                  <div className="inline-flex items-center rounded-full border border-foreground/15">
                    <button
                      onClick={() => setQty(i.slug, i.qty - 1)}
                      className="inline-flex h-9 w-9 items-center justify-center hover:bg-muted"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums">{i.qty}</span>
                    <button
                      onClick={() => setQty(i.slug, i.qty + 1)}
                      className="inline-flex h-9 w-9 items-center justify-center hover:bg-muted"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="font-display text-xl font-bold">{money(i.price * i.qty)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="rounded-2xl border border-foreground/10 bg-[var(--color-surface)] p-6 md:sticky md:top-28 md:h-fit">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-muted-foreground">Calculated at quote</dd>
            </div>
            <div className="flex justify-between border-t border-foreground/10 pt-3">
              <dt className="font-display text-base font-bold">Estimated total</dt>
              <dd className="font-display text-base font-bold">{money(subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Final pricing confirmed in your tailored proposal.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/checkout" className="btn-primary btn-primary-hover">
              Proceed to checkout
            </Link>
            <Link to="/products" className="btn-ghost">
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
