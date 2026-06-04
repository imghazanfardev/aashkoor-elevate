import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Cog, Leaf, Snowflake, Wrench } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/site/Section";
import { PRODUCTS } from "@/lib/data/products";

export const Route = createFileRoute("/products/categories")({
  head: () => ({
    meta: [
      { title: "Product Categories — AASHKOOR" },
      { name: "description", content: "Explore AASHKOOR product categories: HVAC, Agriculture, Valves and Insulation." },
      { property: "og:title", content: "Product Categories — AASHKOOR" },
    ],
    links: [{ rel: "canonical", href: "/products/categories" }],
  }),
  component: CategoriesPage,
});

const CATEGORY_CARDS = [
  { name: "Valves", icon: Cog, color: "from-primary/20 to-primary/5", blurb: "Gate, ball, butterfly, globe and check valves engineered for industrial service." },
  { name: "Insulation", icon: Wrench, color: "from-accent/20 to-accent/5", blurb: "Thermal, acoustic and refractory insulation systems for plants, pipework and envelopes." },
  { name: "HVAC", icon: Snowflake, color: "from-accent/15 to-primary/10", blurb: "HVAC components, chillers, AHUs and BMS-ready modular plant." },
  { name: "Agriculture", icon: Leaf, color: "from-primary/15 to-primary/5", blurb: "Smart irrigation, precision sensing and complete agriculture supply." },
] as const;

function CategoriesPage() {
  return (
    <div>
      <section className="container-prose py-12 md:py-16">
        <SectionHeader
          eyebrow="Categories"
          title="Browse by category."
          description="Four engineered practices, one operating standard."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {CATEGORY_CARDS.map((c, i) => {
            const count = PRODUCTS.filter((p) => p.category === c.name).length;
            return (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link
                  to="/products"
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-br ${c.color} p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elev)]`}
                >
                  <div>
                    <c.icon className="h-10 w-10 text-primary" />
                    <h3 className="mt-6 font-display text-3xl font-bold tracking-tight">{c.name}</h3>
                    <p className="mt-3 max-w-md text-muted-foreground">{c.blurb}</p>
                  </div>
                  <div className="mt-8 flex items-end justify-between">
                    <span className="text-sm font-semibold text-foreground/70">{count} products</span>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Browse <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
