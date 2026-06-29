import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/site/Section";
import hvacImg from "@/assets/division-hvac.jpg";
import agriImg from "@/assets/division-agriculture.jpg";
import valvesImg from "@/assets/division-valves.jpg";
import insulImg from "@/assets/division-insulation.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — AASHKOOR" },
      { name: "description", content: "Explore AASHKOOR's four engineering and supply divisions." },
      { property: "og:title", content: "AASHKOOR Services" },
      { property: "og:description", content: "HVAC, agriculture, industrial valves and insulation." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

const ITEMS = [
  {
    title: "General Valves",
    href: "/valves" as const,
    img: valvesImg,
    desc: "Industrial gate, ball, butterfly, globe and check valves — sourced from certified manufacturers with full traceability and engineered for pipeline, process and utility service.",
  },
  {
    title: "Industrial Insulation",
    href: "/industrial-insulation" as const,
    img: insulImg,
    desc: "Thermal, acoustic and fire-rated insulation systems engineered for pipes, ducts, equipment and building envelopes — including the AASHKOOR Rock and Mineral Wool ranges.",
  },
];

function ServicesPage() {
  return (
    <div>
      <section className="container-prose pb-12 pt-20 md:pt-28">
        <SectionHeader
          eyebrow="What we do"
          title={<>Two divisions, one engineering standard.</>}
          description="AASHKOOR is focused on two engineered practices — industrial valves and industrial insulation. Both are led by senior specialists and backed by full technical documentation."
        />
      </section>

      <section className="container-prose grid gap-6 pb-32 md:grid-cols-2">
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.07}>
            <Link
              to={it.href}
              className="group relative block overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elev)]"
            >
              <div className="aspect-[5/3] overflow-hidden">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="flex items-start justify-between gap-6 p-8">
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{it.title}</h3>
                  <p className="mt-3 max-w-md text-muted-foreground">{it.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Learn more <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
