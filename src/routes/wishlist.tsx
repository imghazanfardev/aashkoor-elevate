import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/stores/wishlist";
import { PRODUCTS } from "@/lib/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — AASHKOOR" },
      { name: "description", content: "Your saved products on AASHKOOR." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const slugs = useWishlist((s) => s.slugs);
  const items = PRODUCTS.filter((p) => slugs.includes(p.slug));

  return (
    <div className="container-prose py-12 md:py-16">
      <SectionHeader
        eyebrow="Wishlist"
        title="Your saved products."
        description="Curate the components that matter to your next project — then request a tailored quote."
      />

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 rounded-3xl border border-foreground/10 bg-card py-24 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">Your wishlist is empty</h3>
            <p className="mt-2 text-muted-foreground">Browse the catalogue and tap the heart on any product.</p>
          </div>
          <Link to="/products" className="btn-primary btn-primary-hover">
            Explore catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <ProductCard key={p.slug} product={p} delay={(i % 6) * 0.05} />
          ))}
        </div>
      )}
    </div>
  );
}
