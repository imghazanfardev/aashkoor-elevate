import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/site/Section";
import { ProductCard } from "@/components/site/ProductCard";
import { usePublishedProducts } from "@/lib/hooks/useCms";

export function FeaturedProducts() {
  const { products } = usePublishedProducts();
  const featured = products.slice(0, 6);
  return (
    <section className="bg-[var(--color-surface)]">
      <div className="container-prose py-24 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Featured products"
            title={<>The catalogue, <span className="text-primary">curated.</span></>}
            description="A small slice of the AASHKOOR catalogue — sourced from certified manufacturers, ready to specify."
          />
          <Reveal delay={0.1}>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Browse all products <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} delay={(i % 3) * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
