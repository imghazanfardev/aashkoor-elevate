import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCart } from "@/lib/stores/cart";
import { money } from "@/lib/format";

export function CartSheet() {
  const isOpen = useCart((s) => s.isOpen);
  const setOpen = useCart((s) => s.setOpen);
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-background shadow-2xl"
            aria-label="Quote cart"
          >
            <header className="flex items-center justify-between border-b border-foreground/10 px-6 py-5">
              <div>
                <p className="eyebrow text-primary">Quote cart</p>
                <h2 className="font-display text-xl font-bold">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 hover:bg-muted"
                aria-label="Close cart"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-20 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold">Your quote cart is empty</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add products to build a tailored quote request.
                    </p>
                  </div>
                  <Link
                    to="/products"
                    onClick={() => setOpen(false)}
                    className="btn-primary btn-primary-hover"
                  >
                    Browse catalogue
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-foreground/10">
                  {items.map((i) => (
                    <li key={i.slug} className="flex gap-4 py-5">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface)]">
                        <img src={i.image} alt={i.name} className="h-full w-full object-contain p-2" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                              {i.category}
                            </p>
                            <Link
                              to="/products/$slug"
                              params={{ slug: i.slug }}
                              onClick={() => setOpen(false)}
                              className="line-clamp-2 text-sm font-semibold hover:text-primary"
                            >
                              {i.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => remove(i.slug)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-end justify-between pt-3">
                          <div className="inline-flex items-center rounded-full border border-foreground/15">
                            <button
                              onClick={() => setQty(i.slug, i.qty - 1)}
                              className="inline-flex h-8 w-8 items-center justify-center hover:bg-muted"
                              aria-label="Decrease"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold tabular-nums">
                              {i.qty}
                            </span>
                            <button
                              onClick={() => setQty(i.slug, i.qty + 1)}
                              className="inline-flex h-8 w-8 items-center justify-center hover:bg-muted"
                              aria-label="Increase"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="font-display text-base font-bold">{money(i.price * i.qty)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-foreground/10 bg-[var(--color-surface)] px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated subtotal</span>
                  <span className="font-display text-2xl font-bold">{money(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Final pricing confirmed in your tailored proposal.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
                    className="btn-primary btn-primary-hover"
                  >
                    Proceed to checkout
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="btn-ghost justify-center"
                  >
                    View cart
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    Continue browsing
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
