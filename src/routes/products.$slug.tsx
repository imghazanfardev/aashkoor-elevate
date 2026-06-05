import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  FileText,
  Heart,
  ShoppingBag,
  ShoppingCart,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
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
      <p className="mt-3 text-muted-foreground">
        The product you're looking for is no longer in our catalogue.
      </p>
      <Link to="/products" className="btn-primary btn-primary-hover mt-8 inline-flex">
        Back to catalogue
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-prose py-32 text-center">
      <h1 className="display-section">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
      <Link to="/products" className="btn-primary btn-primary-hover mt-8 inline-flex">
        Back to catalogue
      </Link>
    </div>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const data = Route.useLoaderData() as { product: Product } | undefined;
  const product = data?.product;
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const add = useCart((s) => s.add);
  const cartItems = useCart((s) => s.items);
  const wishHas = useWishlist((s) => s.has);
  const wishToggle = useWishlist((s) => s.toggle);

  if (!product) {
    return (
      <div className="container-prose py-32 text-center">
        <h1 className="display-section">Product not found</h1>
        <Link to="/products" className="btn-primary btn-primary-hover mt-8 inline-flex">
          Back to catalogue
        </Link>
      </div>
    );
  }

  const liked = wishHas(product.slug);
  const related = getRelated(product.slug);
  const inCart = cartItems.find((i) => i.slug === product.slug);
  const cartQty = inCart?.qty ?? 0;

  // 4-image "gallery" — repeat product image at varied framings.
  const gallery = [product.image, product.image, product.image, product.image];


  const p = product;
  function handleAdd() {
    add(
      {
        slug: p.slug,
        name: p.name,
        image: p.image,
        price: p.price,
        category: p.category,
      },
      qty,
    );
    toast.success(`Added ${qty} × ${p.name} to cart`);
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  return (
    <div>
      <div className="container-prose pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
        <Link
          to="/products"
          className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to catalogue
        </Link>
      </div>

      <section className="container-prose grid gap-12 py-10 md:py-14 lg:grid-cols-[1.1fr_1fr]">
        {/* GALLERY */}
        <div className="flex flex-col gap-4">
          <div
            className="relative aspect-square overflow-hidden rounded-3xl bg-[var(--color-surface)]"
            onMouseMove={handleMove}
            onMouseLeave={() => setZoom(null)}
          >
            <motion.img
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={gallery[active]}
              alt={product.name}
              width={896}
              height={896}
              className="h-full w-full object-contain p-12 transition-transform duration-200"
              style={
                zoom
                  ? {
                      transform: `scale(1.8)`,
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    }
                  : undefined
              }
            />
            {zoom && (
              <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-foreground/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
                Hover to zoom
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-xl border-2 bg-[var(--color-surface)] transition-colors ${
                  i === active ? "border-primary" : "border-transparent hover:border-foreground/15"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain p-3" />
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <p className="eyebrow text-primary">{product.category}</p>
          <h1 className="display-section mt-3">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating) ? "fill-primary text-primary" : "text-foreground/20"
                  }`}
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

          {/* Quantity + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-foreground/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-11 w-11 text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="h-11 w-11 text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary btn-primary-hover">
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <button
              onClick={() => {
                wishToggle(product.slug);
                toast.success(liked ? "Removed from wishlist" : "Saved to wishlist");
              }}
              className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                liked
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-foreground/15 hover:border-foreground/40"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Cart status + checkout CTA */}
          {cartQty > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3 text-sm">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ShoppingCart className="h-4 w-4" />
                </span>
                <span>
                  <strong className="font-semibold text-foreground">{cartQty}</strong> in your cart ·{" "}
                  <span className="text-muted-foreground">{money(product.price * cartQty)}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/cart" className="btn-ghost">
                  View cart
                </Link>
                <Link to="/checkout" className="btn-primary btn-primary-hover">
                  Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Quote request alt path */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/quote" className="btn-ghost">
              <FileText className="h-4 w-4" /> Request a custom quote
            </Link>
          </div>

          {/* Specs */}
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

          {/* Downloads */}
          {product.downloads.length > 0 && (
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
          )}
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
