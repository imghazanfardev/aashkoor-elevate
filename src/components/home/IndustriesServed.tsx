import { Reveal, SectionHeader } from "@/components/site/Section";
import { INDUSTRIES } from "@/lib/data/industries";

export function IndustriesServed() {
  return (
    <section className="bg-[var(--color-surface)]">
      <div className="container-prose py-24 md:py-32">
        <SectionHeader
          eyebrow="Industries we serve"
          title={<>Trusted across the sectors that <span className="text-primary">build the world.</span></>}
          description="From precision agriculture to mega-construction — one operating standard delivered everywhere."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.name} delay={(i % 3) * 0.06}>
              <article className="group relative overflow-hidden rounded-2xl border border-foreground/8 bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elev)]">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={ind.image}
                    alt={ind.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ind.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight">{ind.name}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{ind.blurb}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
