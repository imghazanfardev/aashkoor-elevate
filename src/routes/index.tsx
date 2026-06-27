import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, CheckCircle2, Cog, Wrench } from "lucide-react";
import valvesImg from "@/assets/division-valves.jpg";
import insulImg from "@/assets/division-insulation.jpg";
import { Reveal, SectionHeader } from "@/components/site/Section";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { IndustriesServed } from "@/components/home/IndustriesServed";
import { EngineeringExcellence } from "@/components/home/EngineeringExcellence";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AASHKOOR — Engineering Excellence Across Industries" },
      {
        name: "description",
        content:
          "Premium HVAC, smart agriculture, industrial valves and insulation solutions for enterprises building tomorrow.",
      },
      { property: "og:title", content: "AASHKOOR — Engineering Excellence" },
      { property: "og:description", content: "Premium enterprise HVAC, agriculture and industrial supply." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const DIVISIONS = [
  {
    title: "General Valves",
    href: "/valves",
    icon: Cog,
    image: valvesImg,
    blurb: "Industrial gate, ball, butterfly, globe and check valves from certified manufacturers — engineered for pipeline, process and utility service.",
  },
  {
    title: "Industrial Insulation",
    href: "/industrial-insulation",
    icon: Wrench,
    image: insulImg,
    blurb: "Thermal, acoustic and fire-rated insulation systems for pipes, ducts, equipment and building envelopes.",
  },
] as const;

const STATS = [
  { value: "500+", label: "Projects delivered" },
  { value: "50+", label: "Enterprise clients" },
  { value: "15+", label: "Years of expertise" },
  { value: "98%", label: "Client satisfaction" },
];

function HomePage() {
  return (
    <div>
      {/* HERO SLIDER */}
      <HeroSlider />


      {/* INTRO */}
      <section className="container-prose grid gap-10 py-24 md:grid-cols-[1fr_1.4fr] md:py-32">
        <Reveal>
          <p className="eyebrow">Who we are</p>
          <h2 className="display-section mt-4 text-balance">
            Four divisions. <span className="text-primary">One standard.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            AASHKOOR is a multi-disciplinary industrial group operating across HVAC, agriculture,
            valves and insulation. We engineer, supply and support the systems behind world-class
            facilities — combining decades of operating expertise with a relentless focus on quality.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Certified suppliers & products",
              "End-to-end project delivery",
              "Industrial-grade engineering",
              "Global service network",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* DIVISIONS */}
      <section className="bg-[var(--color-surface)]">
        <div className="container-prose py-24 md:py-32">
          <SectionHeader
            eyebrow="Divisions"
            title={<>Built for the industries <span className="text-primary">that build everything else.</span></>}
            description="Four specialised practices, sharing one operating standard and one engineering culture."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {DIVISIONS.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.08}>
                <Link
                  to={d.href}
                  className="group relative block overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elev)]"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-6 p-7">
                    <div>
                      <div className="flex items-center gap-2 text-primary">
                        <d.icon className="h-4 w-4" />
                        <span className="eyebrow text-primary/90">Division</span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{d.title}</h3>
                      <p className="mt-2 max-w-md text-sm text-muted-foreground">{d.blurb}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <FeaturedProjects />

      {/* INDUSTRIES */}
      <IndustriesServed />

      {/* ENGINEERING EXCELLENCE */}
      <EngineeringExcellence />

      {/* FEATURED PRODUCTS */}
      <FeaturedProducts />

      {/* STATS */}
      <section className="container-prose py-24 md:py-28">
        <div className="grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="flex flex-col gap-3 border-l border-foreground/10 pl-6">
                <span className="number-display text-primary">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="container-prose pb-24 md:pb-32">
        <div className="rounded-3xl bg-[var(--color-foreground)] px-8 py-16 text-background md:px-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow text-background/60">Why AASHKOOR</p>
              <h2 className="display-section mt-4 text-balance">
                The standard that operators trust to specify.
              </h2>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2">
              {[
                ["Engineering-first", "Every spec, every install."],
                ["Certified supply", "Only verified manufacturers."],
                ["Lifecycle support", "From design through service."],
                ["Global delivery", "Project teams worldwide."],
              ].map(([t, d]) => (
                <li key={t}>
                  <h4 className="font-display text-lg font-semibold text-primary">{t}</h4>
                  <p className="mt-1 text-sm text-background/70">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-prose pb-32">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-foreground/10 p-10 md:flex-row md:items-center md:p-14">
            <div className="max-w-xl">
              <h2 className="display-section text-balance">
                Have a project? Let's engineer it together.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Brief our team in minutes — receive a tailored proposal within two business days.
              </p>
            </div>
            <Link to="/quote" search={{ product: "" }} className="btn-primary btn-primary-hover">
              Start your quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
