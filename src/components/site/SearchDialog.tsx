import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePublishedProducts } from "@/lib/hooks/useCms";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { products: PRODUCTS } = usePublishedProducts();


  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.style.overflow = "hidden";
      setQ("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (!q.trim()) return PRODUCTS.slice(0, 5);
    const s = q.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.tags.some((t) => t.includes(s)),
    ).slice(0, 8);
  }, [q, PRODUCTS]);


  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-0 top-0 z-[71] mx-auto max-w-2xl px-4 pt-20"
          >
            <div className="overflow-hidden rounded-2xl bg-background shadow-2xl">
              <form
                className="flex items-center gap-3 border-b border-foreground/10 px-5 py-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (results[0]) {
                    navigate({ to: "/products/$slug", params: { slug: results[0].slug } });
                    onClose();
                  }
                }}
              >
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search valves, insulation, HVAC…"
                  className="w-full bg-transparent text-base placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground">No products found.</p>
                ) : (
                  <ul>
                    {results.map((p) => (
                      <li key={p.slug}>
                        <Link
                          to="/products/$slug"
                          params={{ slug: p.slug }}
                          onClick={onClose}
                          className="flex items-center gap-4 rounded-xl p-3 hover:bg-muted"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface)]">
                            <img src={p.image} alt="" className="h-full w-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-semibold">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.category} · {p.sku}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
