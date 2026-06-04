import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/site/Section";
import img from "@/assets/division-hvac.jpg";

export const Route = createFileRoute("/services/hvac")({
  head: () => ({
    meta: [
      { title: "HVAC Solutions — AASHKOOR" },
      { name: "description", content: "Commercial and industrial HVAC: design, install, maintenance, emergency support." },
      { property: "og:title", content: "AASHKOOR HVAC Solutions" },
      { property: "og:description", content: "Industrial-grade heating, ventilation and air conditioning." },
      { property: "og:image", content: "https://ik.imagekit.io/tn3yztqzbb/Asset%201.png" },
      { property: "og:url", content: "/services/hvac" },
    ],
    links: [{ rel: "canonical", href: "/services/hvac" }],
  }),
  component: HvacPage,
});

const CAPS = [
  "Commercial HVAC design", "Industrial HVAC systems",
  "Ventilation engineering", "Air conditioning installation",
  "Maintenance contracts", "Emergency support 24/7",
  "Energy efficiency audits", "Retrofit & upgrade",
];

function HvacPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-background" />
        </div>
        <div className="container-prose flex min-h-[70vh] flex-col justify-end pb-20 pt-32">
          <p className="eyebrow text-white/70">Division 01 — HVAC</p>
          <h1 className="display-hero mt-5 max-w-4xl text-white">
            Climate systems engineered for industrial reality.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            From skylines to refineries — we design, install and maintain HVAC systems
            built to perform at scale, in any environment.
          </p>
        </div>
      </section>

      <section className="container-prose grid gap-14 py-24 md:grid-cols-[1.1fr_1fr] md:py-32">
        <Reveal>
          <p className="eyebrow">Capabilities</p>
          <h2 className="display-section mt-4">Everything from spec to service.</h2>
          <p className="mt-5 text-muted-foreground">
            Our HVAC division operates as a single accountable team — from initial heat-load
            modeling through commissioning and lifetime service.
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
          <h3 className="font-display text-2xl font-bold md:text-3xl">Ready to brief our HVAC team?</h3>
          <Link to="/quote" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-semibold text-foreground">
            Request a quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
