import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal, SectionHeader } from "@/components/site/Section";
import valves from "@/assets/division-valves.jpg";
import insul from "@/assets/division-insulation.jpg";
import hvac from "@/assets/division-hvac.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Product Catalogue — AASHKOOR" },
      { name: "description", content: "Browse AASHKOOR's industrial product catalogue — valves, insulation, HVAC components and more." },
      { property: "og:title", content: "AASHKOOR Product Catalogue" },
      { property: "og:description", content: "Industrial products from certified manufacturers." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

const PRODUCTS = [
  { name: "Industrial Ball Valve · DN50", category: "Valves", img: valves, spec: "PN40 · Stainless 316" },
  { name: "Cryogenic Pipe Insulation", category: "Insulation", img: insul, spec: "Aerogel · -196°C rated" },
  { name: "Commercial Chiller Module", category: "HVAC", img: hvac, spec: "350 kW · Inverter" },
  { name: "Butterfly Valve · DN200", category: "Valves", img: valves, spec: "EPDM · Wafer type" },
  { name: "Mineral Wool Pipe Cover", category: "Insulation", img: insul, spec: "120 kg/m³" },
  { name: "Rooftop Air Handling Unit", category: "HVAC", img: hvac, spec: "Modular · BMS-ready" },
  { name: "Gate Valve · DN100", category: "Valves", img: valves, spec: "API 600 · Cast steel" },
  { name: "Acoustic Insulation Panel", category: "Insulation", img: insul, spec: "50mm · NRC 0.95" },
] as const;

const CATS = ["All", "Valves", "Insulation", "HVAC"] as const;

function ProductsPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const items = PRODUCTS.filter((p) => cat === "All" || p.category === cat);

  return (
    <div>
      <section className="container-prose pb-10 pt-20 md:pt-28">
        <SectionHeader
          eyebrow="Catalogue"
          title="A curated catalogue for serious engineers."
          description="Every product is sourced from certified manufacturers and backed by full technical documentation."
        />
        <div className="mt-10 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-foreground/15 text-foreground/75 hover:border-foreground/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-prose grid gap-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.name} delay={(i % 6) * 0.05}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-elev)]">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={p.img} alt={p.name} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="eyebrow text-primary/90">{p.category}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.spec}</p>
                <Link to="/quote" className="mt-5 text-sm font-semibold text-primary">
                  Request quote →
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
