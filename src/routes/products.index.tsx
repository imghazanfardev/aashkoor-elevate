import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SectionHeader } from "@/components/site/Section";
import { ProductCard } from "@/components/site/ProductCard";
import { PRODUCTS, CATEGORIES, type ProductCategory } from "@/lib/data/products";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Product Catalogue — AASHKOOR" },
      { name: "description", content: "Browse AASHKOOR's industrial product catalogue — valves and insulation systems." },
      { property: "og:title", content: "AASHKOOR Product Catalogue" },
      { property: "og:description", content: "Industrial products from certified manufacturers." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

type Cat = ProductCategory | "All";
type Sort = "featured" | "name";

const PAGE_SIZE = 9;

function ProductsPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [page, setPage] = useState(1);

  const items = useMemo(() => {
    let list = PRODUCTS.filter((p) => (cat === "All" ? true : p.category === cat));
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.tags.some((t) => t.includes(s)) ||
          p.sku.toLowerCase().includes(s),
      );
    }
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [cat, q, sort]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <section className="container-prose pb-10 pt-12 md:pt-16">
        <SectionHeader
          eyebrow="Catalogue"
          title="A curated catalogue for serious engineers."
          description="Every product is sourced from certified manufacturers and backed by full technical documentation."
        />

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setCat(c.name);
                  setPage(1);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  cat === c.name
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/15 text-foreground/75 hover:border-foreground/40"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products…"
                className="h-11 w-full rounded-full border border-foreground/15 bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none sm:w-64"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 appearance-none rounded-full border border-foreground/15 bg-background pl-10 pr-8 text-sm font-medium focus:border-primary focus:outline-none"
              >
                <option value="featured">Sort: Featured</option>
                <option value="name">Name: A → Z</option>
              </select>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{paged.length}</span> of{" "}
          <span className="font-semibold text-foreground">{items.length}</span> products
        </p>
      </section>

      <section className="container-prose grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map((p, i) => (
          <ProductCard key={p.slug} product={p} delay={(i % 6) * 0.04} />
        ))}
      </section>

      {totalPages > 1 && (
        <section className="container-prose flex items-center justify-center gap-2 pb-32">
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

      {items.length === 0 && (
        <section className="container-prose pb-32 text-center">
          <p className="text-muted-foreground">No products match your search.</p>
          <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-primary">
            Reset filters
          </Link>
        </section>
      )}
    </div>
  );
}
