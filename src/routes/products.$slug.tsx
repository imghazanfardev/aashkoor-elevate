import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Download, FileText, Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { getProduct, getRelated } from "@/lib/data/products";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { money } from "@/lib/format";
import { ProductCard } from "@/components/site/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product not found — AASHKOOR" }] };
    return {
      meta: [
        { title: `${p.name} — AASHKOOR` },
        { name: "description", content: p.blurb },
        { property: "og:title", content: `${p.name} — AASHKOOR` },
        { property: "og:description", content: p.blurb },
        { property: "og:image", content: p.image },
      ],
      links: [{ rel: "canonical", href: `/products/${p.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="container-prose py-32 text-center">
      <h1 className="display-section">Product not found</h1>
      <Link to="/products" className="btn-primary btn-primary-hover mt-8 inline-flex">
        Back to catalogue
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-prose py-32 text-center">
      <h1 className="display-section">Something went wrong</h1>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const wishHas = useWishlist((s) => s.has);
  const wishToggle = useWishlist((s) => s.toggle);
  const liked = wishHas(product.slug);
  const related = getRelated(product.slug);

  return (
    <div>
      <div className="container-prose pt-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to catalogue
        </Link>
      </div>

      <section className="container-prose grid gap-12 py-12 md:py-16 lg:grid-cols-[1.1fr_1fr]">
        <div className="overflow-hidden rounded-3xl bg-[var(--color-surface)]">
          <img
            src={product.image}
            alt={product.name}
            width={896}
            height={896}
            className="aspect-square w-full object-contain p-12"
          />
        </div>

        <div>
          <p className="eyebrow text-primary">{product.category}</p>
          <h1 className="display-section mt-3">{product.name}</h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-primary text-primary" : "text-foreground/20"}`}
                />
              ))}
              <span className="ml-2 font-medium text-foreground">{product.rating}</span>
            </div>
            <span>·</span>
            <span>{product.reviews} reviews</span>
            <span>·</span>
            <span>SKU {product.sku}</span>
          </div>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8 flex items-end gap-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Indicative price</p>
              <p className="font-display text-4xl font-extrabold tracking-tight">{money(product.price)}</p>
            </div>
            <span
              className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                product.inStock ? "bg-primary/10 text-primary" : "bg-warning/15 text-foreground/70"
              }`}
            >
              <Check className="h-3 w-3" /> {product.inStock ? "In stock" : "Lead time 4–6 weeks"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-foreground/15">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11">−</button>
              <span className="w-10 text-center font-semibold tabular-nums">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-11 w-11">+</button>
            </div>
            <button
              onClick={() => {
                add(
                  { slug: product.slug, name: product.name, image: product.image, price: product.price, category: product.category },
                  qty,
                );
                toast.success(`Added ${qty} × ${product.name}`);
              }}
              className="btn-primary btn-primary-hover"
            >
              <ShoppingBag className="h-4 w-4" /> Add to quote
            </button>
            <Link to="/quote" className="btn-ghost">
              <FileText className="h-4 w-4" /> Request quote
            </Link>
            <button
              onClick={() => {
                wishToggle(product.slug);
                toast.success(liked ? "Removed from wishlist" : "Saved to wishlist");
              }}
              className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                liked ? "border-primary bg-primary text-primary-foreground" : "border-foreground/15"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="mt-10 rounded-2xl border border-foreground/10 bg-card p-6">
            <h3 className="font-display text-lg font-bold">Technical specifications</h3>
            <dl className="mt-4 divide-y divide-foreground/10">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 py-3 text-sm">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="text-right font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {product.downloads.map((d) => (
              <a
                key={d.label}
                href={d.href}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm font-semibold hover:border-foreground/40"
              >
                <Download className="h-4 w-4" /> {d.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-[var(--color-surface)]">
          <div className="container-prose py-20">
            <h2 className="display-section">Related products</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} delay={i * 0.05} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
