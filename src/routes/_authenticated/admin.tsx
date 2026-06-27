import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3, FileText, LayoutDashboard, LogOut, Mail, Package, Trash2, Pencil, Plus, BookOpen,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  listQuotes, listContacts, updateQuoteStatus, updateContactStatus, deleteQuote, deleteContact,
} from "@/lib/forms.functions";
import {
  listAllProducts, listAllPosts, upsertProduct, deleteProduct, upsertPost, deletePost,
  type ProductRow, type BlogPostRow,
} from "@/lib/cms.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — AASHKOOR" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const QUOTE_STATUSES = ["new", "contacted", "quoted", "won", "closed"] as const;
type QuoteStatus = typeof QUOTE_STATUSES[number];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  quoted: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  won: "bg-green-500/10 text-green-600 dark:text-green-400",
  closed: "bg-foreground/10 text-foreground/60",
  read: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  archived: "bg-foreground/10 text-foreground/60",
  draft: "bg-amber-500/10 text-amber-600",
  published: "bg-green-500/10 text-green-600",
};

type Tab = "overview" | "quotes" | "contacts" | "products" | "blog";

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [editProduct, setEditProduct] = useState<ProductRow | "new" | null>(null);
  const [editPost, setEditPost] = useState<BlogPostRow | "new" | null>(null);

  const fetchQuotes = useServerFn(listQuotes);
  const fetchContacts = useServerFn(listContacts);
  const fetchProducts = useServerFn(listAllProducts);
  const fetchPosts = useServerFn(listAllPosts);
  const updQuote = useServerFn(updateQuoteStatus);
  const updContact = useServerFn(updateContactStatus);
  const delQuote = useServerFn(deleteQuote);
  const delContact = useServerFn(deleteContact);
  const delProd = useServerFn(deleteProduct);
  const delPst = useServerFn(deletePost);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      setAdminEmail(data.user?.email ?? "");
      if (!uid) { setIsAdmin(false); return; }
      const { data: hasAdmin } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
      setIsAdmin(!!hasAdmin);
    })();
  }, []);

  const enabled = isAdmin === true;
  const quotesQ = useQuery({ queryKey: ["admin-quotes"], queryFn: () => fetchQuotes(), enabled });
  const contactsQ = useQuery({ queryKey: ["admin-contacts"], queryFn: () => fetchContacts(), enabled });
  const productsQ = useQuery({ queryKey: ["admin-products"], queryFn: () => fetchProducts(), enabled });
  const postsQ = useQuery({ queryKey: ["admin-posts"], queryFn: () => fetchPosts(), enabled });

  async function handleLogout() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/admin-access" });
  }

  const quotes = quotesQ.data ?? [];
  const contacts = contactsQ.data ?? [];
  const products = productsQ.data ?? [];
  const posts = postsQ.data ?? [];

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    quotes.forEach((q) => {
      const d = new Date(q.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6)
      .map(([k, v]) => ({ m: k.slice(5), quotes: v }));
  }, [quotes]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    quotes.forEach((q) => { if (q.product_name) map.set(q.product_name, (map.get(q.product_name) ?? 0) + 1); });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [quotes]);

  if (isAdmin === null) {
    return <div className="container-prose py-32 text-center text-muted-foreground">Loading admin dashboard…</div>;
  }
  if (isAdmin === false) {
    return (
      <div className="container-prose py-32 text-center">
        <h1 className="display-section">Access denied</h1>
        <p className="mt-4 text-muted-foreground">Your account does not have administrator privileges.</p>
        <button onClick={handleLogout} className="btn-primary btn-primary-hover mt-8">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    );
  }

  async function changeQuoteStatus(id: string, status: QuoteStatus) {
    try { await updQuote({ data: { id, status } }); toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["admin-quotes"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function changeContactStatus(id: string, status: "new" | "read" | "archived") {
    try { await updContact({ data: { id, status } }); toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["admin-contacts"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function removeQuote(id: string) {
    if (!confirm("Delete this quote request?")) return;
    try { await delQuote({ data: { id } }); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-quotes"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function removeContact(id: string) {
    if (!confirm("Delete this submission?")) return;
    try { await delContact({ data: { id } }); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-contacts"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function removeProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    try { await delProd({ data: { id } }); toast.success("Product deleted"); qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["public-products"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function removePost(id: string) {
    if (!confirm("Delete this post?")) return;
    try { await delPst({ data: { id } }); toast.success("Post deleted"); qc.invalidateQueries({ queryKey: ["admin-posts"] }); qc.invalidateQueries({ queryKey: ["public-posts"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  const TABS = [
    { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
    { id: "products" as const, label: `Products (${products.length})`, icon: Package },
    { id: "blog" as const, label: `Blog (${posts.length})`, icon: BookOpen },
    { id: "quotes" as const, label: `Quotes (${quotes.length})`, icon: FileText },
    { id: "contacts" as const, label: `Contacts (${contacts.length})`, icon: Mail },
  ];

  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <div className="container-prose grid gap-8 py-12 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="px-2">
            <p className="eyebrow text-primary">Admin</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{adminEmail}</p>
          </div>
          <nav className="mt-4 flex flex-row gap-1 overflow-x-auto rounded-2xl border border-foreground/10 bg-card p-2 lg:flex-col">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-foreground text-background" : "text-foreground/75 hover:bg-muted"
                }`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
            <button onClick={handleLogout}
              className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/60 hover:bg-muted">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>

        <main className="space-y-6">
          {tab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Total Products" value={products.length} />
                <Stat label="Total Quotes" value={quotes.length} />
                <Stat label="Total Blog Posts" value={posts.length} />
                <Stat label="Contact Submissions" value={contacts.length} />
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-card p-6">
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Monthly Quote Requests
                </h3>
                <div className="mt-4 h-72">
                  {monthly.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No quote data yet.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthly}>
                        <defs><linearGradient id="qg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.62 0.14 145)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="oklch(0.62 0.14 145)" stopOpacity={0} />
                        </linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                        <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="quotes" stroke="oklch(0.62 0.14 145)" fill="url(#qg)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Panel title="Product Inquiry Statistics">
                  {topProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No product-tied quotes yet.</p>
                  ) : (
                    <ul className="divide-y divide-foreground/10">
                      {topProducts.map(([name, count]) => (
                        <li key={name} className="flex items-center justify-between py-3 text-sm">
                          <span className="font-medium">{name}</span>
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            {count} {count === 1 ? "request" : "requests"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Recent Activities">
                  <ul className="divide-y divide-foreground/10">
                    {[...quotes.slice(0, 3).map((q) => ({ type: "Quote", text: `${q.name} — ${q.product_name ?? "General"}`, date: q.created_at })),
                      ...contacts.slice(0, 3).map((c) => ({ type: "Contact", text: `${c.name} — ${c.subject ?? "Message"}`, date: c.created_at }))]
                      .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
                      .map((a, i) => (
                        <li key={i} className="flex items-center justify-between py-3 text-sm">
                          <div>
                            <span className="mr-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase">{a.type}</span>
                            {a.text}
                          </div>
                          <span className="text-xs text-muted-foreground">{fmtDate(a.date)}</span>
                        </li>
                      ))}
                    {quotes.length === 0 && contacts.length === 0 && (
                      <li className="py-6 text-center text-sm text-muted-foreground">No activity yet.</li>
                    )}
                  </ul>
                </Panel>
              </div>
            </>
          )}

          {tab === "quotes" && (
            <Panel title="Quote requests">
              {quotesQ.isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
                : quotes.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No quote requests yet.</p>
                : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4">Product</th><th className="pb-3 pr-4">Customer</th><th className="pb-3 pr-4">Contact</th>
                    <th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Status</th><th className="pb-3"></th>
                  </tr></thead><tbody className="divide-y divide-foreground/10">
                    {quotes.map((q) => (
                      <tr key={q.id} className="align-top">
                        <td className="py-3 pr-4">
                          <p className="font-semibold">{q.product_name ?? "General inquiry"}</p>
                          <p className="text-xs text-muted-foreground">{q.product_category ?? q.division ?? "—"}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-semibold">{q.name}</p>
                          <p className="text-xs text-muted-foreground">{q.company ?? "—"}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <a href={`mailto:${q.email}`} className="text-primary hover:underline">{q.email}</a>
                          {q.phone && <p className="text-xs text-muted-foreground">{q.phone}</p>}
                        </td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{fmtDate(q.created_at)}</td>
                        <td className="py-3 pr-4">
                          <select value={q.status} onChange={(e) => changeQuoteStatus(q.id, e.target.value as QuoteStatus)}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[q.status] ?? ""}`}>
                            {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="py-3 text-right">
                          <button onClick={() => removeQuote(q.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody></table></div>}
            </Panel>
          )}

          {tab === "contacts" && (
            <Panel title="Contact submissions">
              {contactsQ.isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
                : contacts.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No contact messages yet.</p>
                : <ul className="divide-y divide-foreground/10">
                    {contacts.map((c) => (
                      <li key={c.id} className="grid gap-3 py-4 md:grid-cols-[1fr_auto]">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">{c.name}</span>
                            <a href={`mailto:${c.email}`} className="text-sm text-primary hover:underline">{c.email}</a>
                            {c.phone && <span className="text-xs text-muted-foreground">· {c.phone}</span>}
                          </div>
                          {c.subject && <p className="mt-1 text-sm font-medium">{c.subject}</p>}
                          <p className="mt-1 text-sm text-muted-foreground">{c.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{fmtDate(c.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select value={c.status} onChange={(e) => changeContactStatus(c.id, e.target.value as "new" | "read" | "archived")}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[c.status] ?? ""}`}>
                            <option value="new">new</option><option value="read">read</option><option value="archived">archived</option>
                          </select>
                          <button onClick={() => removeContact(c.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>}
            </Panel>
          )}

          {tab === "products" && (
            <Panel title={`Products (${products.length})`}>
              <div className="mb-4 flex justify-end">
                <button onClick={() => setEditProduct("new")} className="btn-primary btn-primary-hover">
                  <Plus className="h-4 w-4" /> New product
                </button>
              </div>
              {productsQ.isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
                : products.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No products yet.</p>
                : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4">Image</th><th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Status</th><th className="pb-3"></th>
                  </tr></thead><tbody className="divide-y divide-foreground/10">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 pr-4">
                          {p.featured_image
                            ? <img src={p.featured_image} alt="" className="h-12 w-12 rounded-lg bg-[var(--color-surface)] object-contain p-1" />
                            : <div className="h-12 w-12 rounded-lg bg-muted" />}
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">/{p.slug}</p>
                        </td>
                        <td className="py-3 pr-4">{p.category}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => setEditProduct(p)} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => removeProduct(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody></table></div>}
            </Panel>
          )}

          {tab === "blog" && (
            <Panel title={`Blog posts (${posts.length})`}>
              <div className="mb-4 flex justify-end">
                <button onClick={() => setEditPost("new")} className="btn-primary btn-primary-hover">
                  <Plus className="h-4 w-4" /> New post
                </button>
              </div>
              {postsQ.isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
                : posts.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No posts yet.</p>
                : <ul className="divide-y divide-foreground/10">
                    {posts.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-4 py-4">
                        <div className="flex items-center gap-4 min-w-0">
                          {p.featured_image && <img src={p.featured_image} alt="" className="h-12 w-16 rounded-lg object-cover" />}
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{p.title}</p>
                            <p className="text-xs text-muted-foreground">/blog/{p.slug} · {p.category ?? "Uncategorised"} · <span className={`rounded-full px-1.5 py-0.5 ${STATUS_COLORS[p.status]}`}>{p.status}</span></p>
                          </div>
                        </div>
                        <div className="inline-flex gap-2">
                          <button onClick={() => setEditPost(p)} className="text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => removePost(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </li>
                    ))}
                  </ul>}
            </Panel>
          )}
        </main>
      </div>

      {editProduct && (
        <ProductFormModal
          initial={editProduct === "new" ? null : editProduct}
          onClose={() => setEditProduct(null)}
          onSaved={() => { setEditProduct(null); qc.invalidateQueries({ queryKey: ["admin-products"] }); qc.invalidateQueries({ queryKey: ["public-products"] }); }}
        />
      )}
      {editPost && (
        <PostFormModal
          initial={editPost === "new" ? null : editPost}
          onClose={() => setEditPost(null)}
          onSaved={() => { setEditPost(null); qc.invalidateQueries({ queryKey: ["admin-posts"] }); qc.invalidateQueries({ queryKey: ["public-posts"] }); }}
        />
      )}
    </div>
  );
}

function fmtDate(s: string) {
  return new Date(s).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-foreground/10 bg-card p-6">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// ============ Product form modal ============
function ProductFormModal({
  initial, onClose, onSaved,
}: { initial: ProductRow | null; onClose: () => void; onSaved: () => void }) {
  const save = useServerFn(upsertProduct);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(() => ({
    id: initial?.id,
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    category: (initial?.category as "Valves" | "Industrial Insulation") ?? "Valves",
    featured_image: initial?.featured_image ?? "",
    gallery_images: (initial?.gallery_images ?? []).join("\n"),
    short_description: initial?.short_description ?? "",
    full_description: initial?.full_description ?? "",
    specs: JSON.stringify(initial?.specifications ?? [], null, 2),
    features: (initial?.features ?? []).join("\n"),
    applications: (initial?.applications ?? []).join("\n"),
    datasheet_url: initial?.datasheet_url ?? "",
    faqs: JSON.stringify(initial?.faqs ?? [], null, 2),
    seo_title: initial?.seo_title ?? "",
    seo_description: initial?.seo_description ?? "",
    status: (initial?.status as "draft" | "published") ?? "draft",
    sort_order: initial?.sort_order ?? 0,
  }));

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    let specsParsed: { label: string; value: string }[];
    let faqsParsed: { q: string; a: string }[];
    try { specsParsed = form.specs.trim() ? JSON.parse(form.specs) : []; }
    catch { toast.error("Specifications must be valid JSON"); return; }
    try { faqsParsed = form.faqs.trim() ? JSON.parse(form.faqs) : []; }
    catch { toast.error("FAQs must be valid JSON"); return; }

    setBusy(true);
    try {
      await save({
        data: {
          id: form.id,
          name: form.name.trim(),
          slug: form.slug.trim() || slugify(form.name),
          category: form.category,
          featured_image: form.featured_image.trim() || null,
          gallery_images: form.gallery_images.split("\n").map((s) => s.trim()).filter(Boolean),
          short_description: form.short_description.trim() || null,
          full_description: form.full_description.trim() || null,
          specifications: specsParsed,
          features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
          applications: form.applications.split("\n").map((s) => s.trim()).filter(Boolean),
          datasheet_url: form.datasheet_url.trim() || null,
          related_product_ids: [],
          faqs: faqsParsed,
          seo_title: form.seo_title.trim() || null,
          seo_description: form.seo_description.trim() || null,
          status: form.status,
          sort_order: Number(form.sort_order) || 0,
        },
      });
      toast.success("Product saved");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose} title={initial ? "Edit product" : "New product"}>
      <div className="grid gap-4">
        <Row label="Name">
          <input className="adm-input" value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => !form.slug && update("slug", slugify(form.name))} />
        </Row>
        <Row label="Slug (URL)">
          <input className="adm-input" value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} placeholder="e.g. ball-valve-dn50" />
        </Row>
        <Row label="Category">
          <select className="adm-input" value={form.category}
            onChange={(e) => update("category", e.target.value as "Valves" | "Industrial Insulation")}>
            <option value="Valves">Valves</option>
            <option value="Industrial Insulation">Industrial Insulation</option>
          </select>
        </Row>
        <Row label="Featured image URL">
          <input className="adm-input" value={form.featured_image} onChange={(e) => update("featured_image", e.target.value)} placeholder="https://…" />
          {form.featured_image && <img src={form.featured_image} alt="" className="mt-2 h-24 w-24 rounded-lg object-contain bg-[var(--color-surface)]" />}
        </Row>
        <Row label="Gallery image URLs (one per line)">
          <textarea className="adm-input" rows={3} value={form.gallery_images} onChange={(e) => update("gallery_images", e.target.value)} />
        </Row>
        <Row label="Short description">
          <textarea className="adm-input" rows={2} value={form.short_description} onChange={(e) => update("short_description", e.target.value)} />
        </Row>
        <Row label="Full description">
          <textarea className="adm-input" rows={5} value={form.full_description} onChange={(e) => update("full_description", e.target.value)} />
        </Row>
        <Row label='Technical specifications (JSON array of {"label","value"})'>
          <textarea className="adm-input font-mono text-xs" rows={6} value={form.specs} onChange={(e) => update("specs", e.target.value)} />
        </Row>
        <Row label="Features (one per line)">
          <textarea className="adm-input" rows={3} value={form.features} onChange={(e) => update("features", e.target.value)} />
        </Row>
        <Row label="Applications (one per line)">
          <textarea className="adm-input" rows={3} value={form.applications} onChange={(e) => update("applications", e.target.value)} />
        </Row>
        <Row label="Datasheet PDF URL">
          <input className="adm-input" value={form.datasheet_url} onChange={(e) => update("datasheet_url", e.target.value)} placeholder="https://…/datasheet.pdf" />
        </Row>
        <Row label='FAQ (JSON array of {"q","a"})'>
          <textarea className="adm-input font-mono text-xs" rows={5} value={form.faqs} onChange={(e) => update("faqs", e.target.value)} />
        </Row>
        <div className="grid gap-4 md:grid-cols-2">
          <Row label="SEO title">
            <input className="adm-input" value={form.seo_title} onChange={(e) => update("seo_title", e.target.value)} />
          </Row>
          <Row label="SEO description">
            <input className="adm-input" value={form.seo_description} onChange={(e) => update("seo_description", e.target.value)} />
          </Row>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Row label="Status">
            <select className="adm-input" value={form.status} onChange={(e) => update("status", e.target.value as "draft" | "published")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Row>
          <Row label="Sort order">
            <input className="adm-input" type="number" value={form.sort_order} onChange={(e) => update("sort_order", Number(e.target.value))} />
          </Row>
        </div>
        <FormFooter busy={busy} onCancel={onClose} onSave={submit} />
      </div>
      <style>{`.adm-input{width:100%;border:1px solid color-mix(in oklab,var(--foreground) 15%,transparent);border-radius:10px;padding:.55rem .75rem;font-size:.875rem;background:var(--background);}
        .adm-input:focus{outline:none;border-color:var(--color-primary);}`}</style>
    </Modal>
  );
}

// ============ Blog form modal ============
function PostFormModal({
  initial, onClose, onSaved,
}: { initial: BlogPostRow | null; onClose: () => void; onSaved: () => void }) {
  const save = useServerFn(upsertPost);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    id: initial?.id,
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? "",
    featured_image: initial?.featured_image ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    seo_title: initial?.seo_title ?? "",
    seo_description: initial?.seo_description ?? "",
    status: (initial?.status as "draft" | "published") ?? "draft",
  });
  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setBusy(true);
    try {
      await save({
        data: {
          id: form.id,
          title: form.title.trim(),
          slug: form.slug.trim() || slugify(form.title),
          category: form.category.trim() || null,
          featured_image: form.featured_image.trim() || null,
          excerpt: form.excerpt.trim() || null,
          content: form.content.trim() || null,
          seo_title: form.seo_title.trim() || null,
          seo_description: form.seo_description.trim() || null,
          status: form.status,
        },
      });
      toast.success("Post saved");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal onClose={onClose} title={initial ? "Edit post" : "New post"}>
      <div className="grid gap-4">
        <Row label="Title">
          <input className="adm-input" value={form.title}
            onChange={(e) => update("title", e.target.value)}
            onBlur={() => !form.slug && update("slug", slugify(form.title))} />
        </Row>
        <Row label="Slug (URL)">
          <input className="adm-input" value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} />
        </Row>
        <Row label="Category">
          <input className="adm-input" value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="HVAC, Valves, Insulation…" />
        </Row>
        <Row label="Featured image URL">
          <input className="adm-input" value={form.featured_image} onChange={(e) => update("featured_image", e.target.value)} />
          {form.featured_image && <img src={form.featured_image} alt="" className="mt-2 h-32 w-full rounded-lg object-cover" />}
        </Row>
        <Row label="Excerpt">
          <textarea className="adm-input" rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />
        </Row>
        <Row label="Content (plain text / markdown)">
          <textarea className="adm-input" rows={10} value={form.content} onChange={(e) => update("content", e.target.value)} />
        </Row>
        <div className="grid gap-4 md:grid-cols-2">
          <Row label="SEO title">
            <input className="adm-input" value={form.seo_title} onChange={(e) => update("seo_title", e.target.value)} />
          </Row>
          <Row label="SEO description">
            <input className="adm-input" value={form.seo_description} onChange={(e) => update("seo_description", e.target.value)} />
          </Row>
        </div>
        <Row label="Status">
          <select className="adm-input" value={form.status} onChange={(e) => update("status", e.target.value as "draft" | "published")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Row>
        <FormFooter busy={busy} onCancel={onClose} onSave={submit} />
      </div>
      <style>{`.adm-input{width:100%;border:1px solid color-mix(in oklab,var(--foreground) 15%,transparent);border-radius:10px;padding:.55rem .75rem;font-size:.875rem;background:var(--background);}
        .adm-input:focus{outline:none;border-color:var(--color-primary);}`}</style>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function FormFooter({ busy, onCancel, onSave }: { busy: boolean; onCancel: () => void; onSave: () => void }) {
  return (
    <div className="mt-4 flex items-center justify-end gap-3">
      <button onClick={onCancel} className="btn-ghost">Cancel</button>
      <button disabled={busy} onClick={onSave} className="btn-primary btn-primary-hover disabled:opacity-50">
        {busy ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
