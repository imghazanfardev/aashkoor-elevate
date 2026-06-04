import { createFileRoute } from "@tanstack/react-router";
import { Reveal, SectionHeader } from "@/components/site/Section";
import heroImg from "@/assets/hero-industrial.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AASHKOOR — Industrial Engineering Group" },
      { name: "description", content: "AASHKOOR is a multi-disciplinary industrial group spanning HVAC, agriculture, valves and insulation." },
      { property: "og:title", content: "About AASHKOOR" },
      { property: "og:description", content: "Our mission, story and values." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const VALUES = [
  ["Engineering excellence", "We solve hard problems with rigor, not shortcuts."],
  ["Integrity at every level", "Honest specs, honest pricing, honest timelines."],
  ["Long-term partnership", "We are not vendors — we are operating partners."],
  ["Continuous innovation", "We invest in better methods, materials and people."],
];

const TIMELINE = [
  ["2008", "Founded as a specialist HVAC engineering practice."],
  ["2013", "Expanded into industrial valves supply for refining operators."],
  ["2017", "Launched smart agriculture division across emerging markets."],
  ["2021", "Opened insulation supply line for energy-intensive facilities."],
  ["2025", "Operating across 4 divisions and dozens of enterprise customers."],
];

function AboutPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-[var(--color-surface)]">
        <div className="container-prose grid gap-12 py-24 md:grid-cols-[1.1fr_1fr] md:py-32">
          <Reveal>
            <p className="eyebrow">About AASHKOOR</p>
            <h1 className="display-hero mt-5 text-balance">
              An industrial group built for the next century.
            </h1>
            <p className="mt-7 max-w-xl text-lg text-muted-foreground">
              We engineer, supply and support the systems behind world-class facilities — quietly,
              reliably and at the standard our customers' operations demand.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="aspect-[4/5] overflow-hidden rounded-3xl">
              <img src={heroImg} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-prose grid gap-16 py-24 md:grid-cols-2 md:py-32">
        <Reveal>
          <p className="eyebrow">Mission</p>
          <h2 className="display-section mt-4">Make industrial systems quietly excellent.</h2>
          <p className="mt-5 text-muted-foreground">
            Every component we supply and every system we engineer is selected and tuned for a
            single outcome: operations that just work, year after year, with no drama.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Vision</p>
          <h2 className="display-section mt-4">The trusted standard across four industries.</h2>
          <p className="mt-5 text-muted-foreground">
            To be the operating partner of choice for HVAC, agriculture, valves and insulation —
            wherever operators want certainty, not surprises.
          </p>
        </Reveal>
      </section>

      <section className="bg-[var(--color-surface)]">
        <div className="container-prose py-24 md:py-32">
          <SectionHeader eyebrow="Values" title="The principles we operate by." />
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="border-t border-foreground/15 pt-6">
                  <h3 className="font-display text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-prose py-24 md:py-32">
        <SectionHeader eyebrow="Timeline" title="Built deliberately, year by year." />
        <ol className="mt-14 grid gap-6">
          {TIMELINE.map(([year, text], i) => (
            <Reveal key={year} delay={i * 0.05}>
              <li className="grid grid-cols-[80px_1fr] items-baseline gap-6 border-t border-foreground/10 pt-6 md:grid-cols-[120px_1fr]">
                <span className="font-display text-2xl font-bold text-primary md:text-3xl">{year}</span>
                <p className="text-foreground/85 md:text-lg">{text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>
    </div>
  );
}
