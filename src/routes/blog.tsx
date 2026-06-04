import { createFileRoute } from "@tanstack/react-router";
import { Reveal, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Insights — AASHKOOR" },
      { name: "description", content: "Engineering perspectives, industry analysis and case studies from AASHKOOR." },
      { property: "og:title", content: "AASHKOOR Insights" },
      { property: "og:description", content: "Engineering perspectives and industry analysis." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

const POSTS = [
  { title: "Designing HVAC for Hyperscale Data Centres", cat: "HVAC", read: "8 min" },
  { title: "Precision Irrigation: ROI in the First Season", cat: "Agriculture", read: "6 min" },
  { title: "Selecting Valves for Cryogenic Service", cat: "Valves", read: "10 min" },
  { title: "Insulation Standards for Energy-Intensive Sites", cat: "Insulation", read: "7 min" },
  { title: "Building a Maintenance Programme that Pays for Itself", cat: "HVAC", read: "5 min" },
  { title: "Sensor Strategy for Smart Farming Operations", cat: "Agriculture", read: "9 min" },
];

function BlogPage() {
  return (
    <div className="container-prose pb-32 pt-20 md:pt-28">
      <SectionHeader
        eyebrow="Insights"
        title="Engineering perspectives from our practice."
        description="Field notes, case studies and analysis from the AASHKOOR engineering team."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p, i) => (
          <Reveal key={p.title} delay={(i % 6) * 0.05}>
            <article className="group flex h-full flex-col rounded-2xl border border-foreground/10 bg-card p-7 transition-shadow hover:shadow-[var(--shadow-soft)]">
              <span className="eyebrow text-primary/90">{p.cat}</span>
              <h3 className="mt-4 font-display text-xl font-semibold leading-tight">{p.title}</h3>
              <p className="mt-auto pt-8 text-xs text-muted-foreground">{p.read} read</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
