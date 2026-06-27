import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostBySlug } from "@/lib/cms.functions";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — AASHKOOR Insights` }],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="container-prose py-32 text-center">
      <h1 className="display-section">Post not found</h1>
      <Link to="/blog" className="btn-primary btn-primary-hover mt-8 inline-flex">Back to insights</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-prose py-32 text-center">
      <h1 className="display-section">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const getOne = useServerFn(getPublishedPostBySlug);
  const q = useQuery({ queryKey: ["public-post", slug], queryFn: () => getOne({ data: { slug } }) });

  if (q.isLoading) return <div className="container-prose py-32 text-center text-muted-foreground">Loading…</div>;
  if (!q.data) throw notFound();
  const p = q.data;

  return (
    <article className="container-prose pb-32 pt-12 md:pt-20">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to insights
      </Link>
      {p.category && <p className="eyebrow mt-8 text-primary">{p.category}</p>}
      <h1 className="display-hero mt-3">{p.title}</h1>
      {p.published_at && (
        <p className="mt-4 text-sm text-muted-foreground">
          {new Date(p.published_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>
      )}
      {p.featured_image && (
        <div className="mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-[var(--color-surface)]">
          <img src={p.featured_image} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      {p.excerpt && <p className="mt-10 text-xl leading-relaxed text-muted-foreground">{p.excerpt}</p>}
      {p.content && (
        <div className="prose prose-lg mt-10 max-w-none whitespace-pre-wrap text-foreground/85">
          {p.content}
        </div>
      )}
    </article>
  );
}
