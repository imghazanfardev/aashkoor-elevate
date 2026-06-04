import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/site/Section";
import { PROJECTS } from "@/lib/data/projects";

export function FeaturedProjects() {
  return (
    <section className="bg-background">
      <div className="container-prose py-24 md:py-32">
        <SectionHeader
          eyebrow="Featured projects"
          title={<>Engineering that <span className="text-primary">moves industries.</span></>}
          description="A selection of delivered programs across our four divisions — each one held to a single operating standard."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.07}>
              <article className="group relative overflow-hidden rounded-3xl bg-foreground text-background shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elev)]">
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
                  <div className="absolute left-6 top-6 flex gap-2">
                    <span className="rounded-full bg-background/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md">
                      {p.division}
                    </span>
                    <span className="rounded-full bg-background/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md">
                      {p.year}
                    </span>
                  </div>
                </div>
                <div className="relative -mt-24 p-8">
                  <h3 className="font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-background/70">{p.location}</p>
                  <p className="mt-4 max-w-md text-sm text-background/80">{p.blurb}</p>

                  <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-background/15 pt-6">
                    {p.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="text-[10px] uppercase tracking-wider text-background/55">{s.label}</dt>
                        <dd className="mt-1 font-display text-xl font-bold text-primary">{s.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    to="/contact"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    View project <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
