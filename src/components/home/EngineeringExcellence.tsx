import { Award, BadgeCheck, Headset, Truck, Users, Wrench } from "lucide-react";
import { Reveal, SectionHeader } from "@/components/site/Section";

const PILLARS = [
  { icon: Award, title: "Quality Assurance", body: "ISO-aligned QA across every supplier, every shipment, every install." },
  { icon: BadgeCheck, title: "Certified Solutions", body: "Only verified manufacturers — full documentation packs included." },
  { icon: Users, title: "Expert Team", body: "Senior engineers with decades of operating experience across sectors." },
  { icon: Truck, title: "Fast Delivery", body: "Engineered logistics with on-time performance across mega-projects." },
  { icon: Headset, title: "Technical Support", body: "Specification, commissioning and lifecycle support — globally." },
  { icon: Wrench, title: "Lifecycle Service", body: "From design through service — your single accountable partner." },
];

export function EngineeringExcellence() {
  return (
    <section className="bg-background">
      <div className="container-prose py-24 md:py-32">
        <SectionHeader
          eyebrow="Engineering excellence"
          title={<>Six commitments. <span className="text-primary">Zero shortcuts.</span></>}
          description="The operating standard behind every AASHKOOR deliverable."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-foreground/10 bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elev)]">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
