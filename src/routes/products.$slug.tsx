import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Download, FileText, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toProduct } from "@/lib/data/products";
import { getPublishedProductBySlug, listPublishedProducts } from "@/lib/cms.functions";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — AASHKOOR` },
    ],
    links: [{ rel: "canonical", href: `/products/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="container-prose py-32 text-center">
      <h1 className="display-section">Product not found</h1>
      <Link to="/products" className="btn-primary btn-primary-hover mt-8 inline-flex">
        Back to catalogue
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-prose py-32 text-center">
      <h1 className="display-section">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
      <Link to="/products" className="btn-primary btn-primary-hover mt-8 inline-flex">
        Back to catalogue
      </Link>
    </div>
  ),
  component: ProductDetail,
});

const DEFAULT_FAQS = [
  { q: "What lead times can I expect?", a: "Stock items typically ship in 5–10 business days. Made-to-order configurations are 4–6 weeks." },
  { q: "Do you provide certificates of conformity?", a: "Yes — EN 10204 3.1/3.2 mill certificates and full traceability are included on request." },
  { q: "Can you support installation and commissioning?", a: "Our field engineering team can support site survey, installation oversight and commissioning across all regions we serve." },
];

const DEFAULT_APPLICATIONS = [
  "Oil, gas & petrochemical facilities",
  "Water treatment and desalination",
  "Industrial HVAC and district cooling",
  "Power generation",
  "Marine & offshore",
];

function ProductDetail() {
  const { slug } = Route.useParams();
  const getOne = useServerFn(getPublishedProductBySlug);
  const listAll = useServerFn(listPublishedProducts);
  const [active, setActive] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const productQ = useQuery({
    queryKey: ["public-product", slug],
    queryFn: () => getOne({ data: { slug } }),
  });
  const allQ = useQuery({
    queryKey: ["public-products"],
    queryFn: () => listAll(),
    staleTime: 60_000,
  });

  if (productQ.isLoading) {
    return <div className="container-prose py-32 text-center text-muted-foreground">Loading…</div>;
  }
  if (!productQ.data) {
    throw notFound();
  }

  const product = toProduct(productQ.data);
  const all = (allQ.data ?? []).map(toProduct);
  const related =
    product.relatedIds.length > 0
      ? all.filter((p) => product.relatedIds.includes(p.id)).slice(0, 3)
      : all.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  const gallery = product.gallery.length > 0
    ? [product.image, ...product.gallery]
    : [product.image, product.image, product.image, product.image];
  const applications = product.applications.length > 0 ? product.applications : DEFAULT_APPLICATIONS;
  const faqs = product.faqs.length > 0 ? product.faqs : DEFAULT_FAQS;

  return (
    <div>
      <div className="container-prose pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
        <Link to="/products" className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to catalogue
        </Link>
      </div>

      <section className="container-prose grid gap-12 py-10 md:py-14 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-[var(--color-surface)]">
            <motion.img
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={gallery[active]}
              alt={product.name}
              width={896}
              height={896}
              className="h-full w-full object-contain p-12"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {gallery.slice(0, 4).map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-xl border-2 bg-[var(--color-surface)] transition-colors ${
                  i === active ? "border-primary" : "border-transparent hover:border-foreground/15"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain p-3" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow text-primary">{product.category}</p>
          <h1 className="display-section mt-3">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating) ? "fill-primary text-primary" : "text-foreground/20"
                  }`}
                />
              ))}
              <span className="ml-2 font-medium text-foreground">{product.rating}</span>
            </div>
            <span>·</span>
            <span>SKU {product.sku}</span>
          </div>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Check className="h-3 w-3" /> {product.inStock ? "Available — quick lead time" : "Made to order · 4–6 weeks"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/quote" search={{ product: product.slug }} className="btn-primary btn-primary-hover">
              <FileText className="h-4 w-4" /> Request Quote
            </Link>
            <Link to="/contact" className="btn-ghost">
              Talk to an engineer
            </Link>
          </div>

          {product.specs.length > 0 && (
            <div className="mt-10 rounded-2xl border border-foreground/10 bg-card p-6">
              <h3 className="font-display text-lg font-bold">Technical specifications</h3>
              <dl className="mt-4 divide-y divide-foreground/10">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="text-right font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {product.features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display text-lg font-bold">Features</h3>
              <ul className="mt-4 space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.datasheetUrl && (
            <div className="mt-6">
              <h3 className="font-display text-lg font-bold">Downloads & datasheets</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm font-semibold hover:border-foreground/40"
                >
                  <Download className="h-4 w-4" /> Datasheet (PDF)
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[var(--color-surface)]">
        <div className="container-prose grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-primary">Applications</p>
            <h2 className="display-section mt-3">Built for demanding environments.</h2>
            <ul className="mt-8 space-y-3">
              {applications.map((a) => (
                <li key={a} className="flex items-start gap-3 text-foreground/85">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-primary">Frequently asked</p>
            <h2 className="display-section mt-3">Specifying with confidence.</h2>
            <ul className="mt-8 divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card">
              {faqs.map((f, i) => (
                <li key={f.q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold"
                  >
                    {f.q}
                    <span className="text-muted-foreground">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <div className="container-prose py-20">
            <h2 className="display-section">Related products</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.slug} product={p} delay={i * 0.05} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
