import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS, type ProductCategory } from "@/lib/data/products";

const PAGE_SIZE = 9;

const FAQS = [
  { q: "What documentation ships with every product?", a: "EN 10204 3.1 mill certificates, material traceability, dimensional drawings and installation guidance are included with every order." },
  { q: "How do I request a tailored quotation?", a: "Use the Request Quote button — your inquiry routes directly to our engineering desk and a tailored proposal is returned within two business days." },
  { q: "Do you support project delivery and on-site work?", a: "Yes — site survey, installation oversight, commissioning and after-sales support are available across all regions we serve." },
  { q: "Can I order non-standard configurations?", a: "Made-to-order configurations are routine for us. Share your specification and we will engineer the right solution." },
];

export type CategoryPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  category: ProductCategory;
  related?: { label: string; href: "/valves" | "/industrial-insulation" | "/products" }[];
};

export function CategoryPage({ eyebrow, title, description, category, related = [] }: CategoryPageProps) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const all = useMemo(() => PRODUCTS.filter((p) => p.category === category), [category]);

  const items = useMemo(() => {
    if (!q.trim()) return all;
    const s = q.toLowerCase();
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.tags.some((t) => t.includes(s)) ||
        p.sku.toLowerCase().includes(s),
    );
  }, [all, q]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      {/* Hero / banner */}
      <section className="relative overflow-hidden bg-[var(--color-surface)]">
        <div className="container-prose grid gap-10 py-20 md:grid-cols-[1.4fr_1fr] md:py-28">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-foreground">Products</Link>
              <span>/</span>
              <span className="text-foreground">{title}</span>
            </nav>
            <p className="eyebrow mt-6 text-primary">{eyebrow}</p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="display-hero mt-3"
            >
              {title}
            </motion.h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/quote" search={{ product: "" }} className="btn-primary btn-primary-hover">
                Request Quote
              </Link>
              <Link to="/contact" className="btn-ghost">
                Talk to an engineer
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-end gap-4 rounded-3xl border border-foreground/10 bg-card p-8 shadow-[var(--shadow-soft)]">
            <p className="eyebrow text-primary">At a glance</p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="font-display text-4xl font-bold tracking-tight">{all.length}</div>
                <p className="mt-1 text-sm text-muted-foreground">Products listed</p>
              </div>
              <div>
                <div className="font-display text-4xl font-bold tracking-tight">100%</div>
                <p className="mt-1 text-sm text-muted-foreground">Certified suppliers</p>
              </div>
              <div>
                <div className="font-display text-4xl font-bold tracking-tight">3.1</div>
                <p className="mt-1 text-sm text-muted-foreground">EN 10204 docs</p>
              </div>
              <div>
                <div className="font-display text-4xl font-bold tracking-tight">48h</div>
                <p className="mt-1 text-sm text-muted-foreground">Quote turnaround</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + grid */}
      <section className="container-prose pt-12 md:pt-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Browse the {title.toLowerCase()} range</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{paged.length}</span> of{" "}
              <span className="font-semibold text-foreground">{items.length}</span> products
            </p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${title.toLowerCase()}…`}
              className="h-11 w-full rounded-full border border-foreground/15 bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none sm:w-72"
            />
          </div>
        </div>
      </section>

      <section className="container-prose mt-10 grid gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((p, i) => (
          <ProductCard key={p.slug} product={p} delay={(i % 6) * 0.04} />
        ))}
      </section>

      {totalPages > 1 && (
        <section className="container-prose flex items-center justify-center gap-2 pb-20">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors ${
                  n === safePage
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/15 hover:border-foreground/40"
                }`}
              >
                {n}
              </button>
            );
          })}
        </section>
      )}

      {/* Quote CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-prose flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <p className="eyebrow text-primary-foreground/70">Need something specific?</p>
            <h2 className="display-section mt-3 text-primary-foreground">Brief our engineering desk.</h2>
            <p className="mt-3 max-w-xl text-primary-foreground/85">
              Send your specification and we will return a tailored proposal — typically within two business days.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/quote"
              search={{ product: "" }}
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary"
            >
              Request a quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-prose py-20">
          <p className="eyebrow text-primary">Related categories</p>
          <h2 className="display-section mt-3">Explore the rest of the catalogue.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.href}
                to={r.href}
                className="group flex items-center justify-between rounded-3xl border border-foreground/10 bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elev)]"
              >
                <span className="font-display text-xl font-bold tracking-tight">{r.label}</span>
                <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-[var(--color-surface)]">
        <div className="container-prose py-20">
          <p className="eyebrow text-primary">Frequently asked</p>
          <h2 className="display-section mt-3">Specifying with confidence.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-foreground/10 bg-card p-6">
                <h3 className="font-display text-base font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
