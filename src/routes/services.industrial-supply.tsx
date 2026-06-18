import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/site/Section";
import valves from "@/assets/division-valves.jpg";
import insul from "@/assets/division-insulation.jpg";

export const Route = createFileRoute("/services/industrial-supply")({
  head: () => ({
    meta: [
      { title: "Industrial Supply — Valves & Insulation | AASHKOOR" },
      { name: "description", content: "Premium industrial valves, fittings, pipe components and insulation supply." },
      { property: "og:title", content: "AASHKOOR Industrial Supply" },
      { property: "og:description", content: "B2B valves and insulation supply from certified manufacturers." },
      { property: "og:image", content: "https://ik.imagekit.io/tn3yztqzbb/Asset%201.png" },
      { property: "og:url", content: "/services/industrial-supply" },
    ],
    links: [{ rel: "canonical", href: "/services/industrial-supply" }],
  }),
  component: Page,
});

const CATEGORIES = [
  { title: "General Valves", img: valves,
    items: ["Ball valves", "Gate valves", "Globe valves", "Butterfly valves", "Check valves"] },
  { title: "Industrial Insulation", img: insul,
    items: ["Pipe insulation", "Thermal blankets", "Cryogenic insulation", "Acoustic systems", "Refractory linings"] },
  { title: "Filters & Components", img: valves,
    items: ["Strainers", "Cartridge filters", "Y-strainers", "Coalescing filters"] },
  { title: "Pipe Components", img: insul,
    items: ["Flanges", "Fittings", "Couplings", "Expansion joints"] },
];

function Page() {
  return (
    <div>
      <section className="container-prose pb-12 pt-20 md:pt-28">
        <SectionHeader
          eyebrow="Industrial Supply"
          title="Premium B2B catalogue — engineered, certified, in stock."
          description="A premium supply experience for engineers and procurement teams. Curated manufacturers, full documentation, fast delivery."
        />
      </section>

      <section className="container-prose grid gap-6 pb-24 md:grid-cols-2">
        {CATEGORIES.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <div className="overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)]">
              <div className="aspect-[5/3] overflow-hidden">
                <img src={c.img} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl font-bold">{c.title}</h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm text-foreground/85">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {it}
                    </li>
                  ))}
                </ul>
                <Link to="/products" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Browse catalogue <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="container-prose pb-32">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-foreground/10 p-10 md:flex-row md:items-center md:p-14">
            <h3 className="display-section">Need a specific spec?</h3>
            <Link to="/quote" search={{ product: "" }} className="btn-primary btn-primary-hover">Request a quote</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
