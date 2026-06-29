import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/site/Section";
import img from "@/assets/division-agriculture.jpg";

export const Route = createFileRoute("/services/agriculture")({
  head: () => ({
    meta: [
      { title: "Agriculture Solutions — AASHKOOR" },
      { name: "description", content: "Smart farming, precision irrigation, crop solutions and agricultural consulting." },
      { property: "og:title", content: "AASHKOOR Agriculture" },
      { property: "og:description", content: "Modern agriculture services at scale." },
      { property: "og:image", content: "https://ik.imagekit.io/tn3yztqzbb/Asset%201.png" },
      { property: "og:url", content: "/services/agriculture" },
    ],
    links: [{ rel: "canonical", href: "/services/agriculture" }],
  }),
  component: AgriPage,
});

const CAPS = [
  "Smart farming systems", "Precision irrigation design",
  "Crop solutions & advisory", "Agricultural consulting",
  "Equipment supply & support", "Soil and climate analytics",
];

function AgriPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-background" />
        </div>
        <div className="container-prose flex min-h-[70vh] flex-col justify-end pb-20 pt-32">
          <p className="eyebrow text-white/70">Division 02 — Agriculture</p>
          <h1 className="display-hero mt-5 max-w-4xl text-white">
            Smart agriculture, engineered at landscape scale.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            We design and deploy the irrigation, crop and analytics systems modern operators
            need to grow more, with less.
          </p>
        </div>
      </section>

      <section className="container-prose grid gap-14 py-24 md:grid-cols-[1.1fr_1fr] md:py-32">
        <Reveal>
          <p className="eyebrow">Capabilities</p>
          <h2 className="display-section mt-4">Field to dashboard.</h2>
          <p className="mt-5 text-muted-foreground">
            Our agriculture practice combines on-the-ground experience with modern sensing and
            analytics so every decision is grounded in real data.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CAPS.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <CtaBlock />
    </div>
  );
}

function CtaBlock() {
  return (
    <section className="container-prose pb-32">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary px-10 py-12 text-primary-foreground md:flex-row md:items-center md:px-14">
          <h3 className="font-display text-2xl font-bold md:text-3xl">Planning a project?</h3>
          <Link to="/quote" search={{ product: "" }} className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-semibold text-foreground">
            Talk to our agronomists <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
