import { Link } from "@tanstack/react-router";
import { Heart, FileText, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { money } from "@/lib/format";
import type { Product } from "@/lib/data/products";
import { toast } from "sonner";

export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const add = useCart((s) => s.add);
  const wishHas = useWishlist((s) => s.has);
  const wishToggle = useWishlist((s) => s.toggle);
  const liked = wishHas(product.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/8 bg-card shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elev)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--color-surface)]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={896}
          height={896}
          className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
        />

        <button
          onClick={() => {
            wishToggle(product.slug);
            toast.success(liked ? "Removed from wishlist" : "Added to wishlist");
          }}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all ${
            liked
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 text-foreground/70 hover:bg-background"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        </button>

        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
            Lead time
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="eyebrow text-primary/90">{product.category}</span>
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.blurb}</p>

        <ul className="mt-4 space-y-1 text-xs text-foreground/65">
          {product.specs.slice(0, 2).map((s) => (
            <li key={s.label} className="flex justify-between gap-3">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-medium text-foreground/80">{s.value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-display text-xl font-bold text-foreground">{money(product.price)}</p>
          </div>
          <span className="text-xs text-muted-foreground">{product.sku}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-foreground/15 px-3 py-2.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <Eye className="h-3.5 w-3.5" /> Details
          </Link>
          <button
            onClick={() => {
              add(
                {
                  slug: product.slug,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                  category: product.category,
                },
                1,
              );
              toast.success("Added to quote cart");
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <FileText className="h-3.5 w-3.5" /> Quote
          </button>
        </div>
      </div>
    </motion.article>
  );
}
