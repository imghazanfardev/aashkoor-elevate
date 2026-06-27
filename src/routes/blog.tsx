import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, SectionHeader } from "@/components/site/Section";
import { usePublishedPosts } from "@/lib/hooks/useCms";

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

function BlogPage() {
  const { data: posts = [], isLoading } = usePublishedPosts();

  return (
    <div className="container-prose pb-32 pt-20 md:pt-28">
      <SectionHeader
        eyebrow="Insights"
        title="Engineering perspectives from our practice."
        description="Field notes, case studies and analysis from the AASHKOOR engineering team."
      />
      {isLoading ? (
        <p className="mt-14 text-center text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-14 text-center text-muted-foreground">No posts published yet — check back soon.</p>
      ) : (
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 6) * 0.05}>
              <Link to="/blog/$slug" params={{ slug: p.slug }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card transition-shadow hover:shadow-[var(--shadow-soft)]">
                {p.featured_image && (
                  <div className="aspect-[16/9] overflow-hidden bg-[var(--color-surface)]">
                    <img src={p.featured_image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-7">
                  {p.category && <span className="eyebrow text-primary/90">{p.category}</span>}
                  <h3 className="mt-4 font-display text-xl font-semibold leading-tight">{p.title}</h3>
                  {p.excerpt && <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                  {p.published_at && (
                    <p className="mt-auto pt-8 text-xs text-muted-foreground">
                      {new Date(p.published_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
