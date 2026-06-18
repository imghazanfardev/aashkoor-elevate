import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3, FileText, LayoutDashboard, LogOut, Mail, Package, Trash2, Search,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  listQuotes, listContacts, updateQuoteStatus, updateContactStatus, deleteQuote, deleteContact,
} from "@/lib/forms.functions";
import { PRODUCTS } from "@/lib/data/products";
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
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"overview" | "quotes" | "contacts" | "products">("overview");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState("");

  const fetchQuotes = useServerFn(listQuotes);
  const fetchContacts = useServerFn(listContacts);
  const updQuote = useServerFn(updateQuoteStatus);
  const updContact = useServerFn(updateContactStatus);
  const delQuote = useServerFn(deleteQuote);
  const delContact = useServerFn(deleteContact);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      setAdminEmail(data.user?.email ?? "");
      if (!uid) {
        setIsAdmin(false);
        return;
      }
      const { data: hasAdmin } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
      setIsAdmin(!!hasAdmin);
    })();
  }, []);

  const quotesQ = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: () => fetchQuotes(),
    enabled: isAdmin === true,
  });
  const contactsQ = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: () => fetchContacts(),
    enabled: isAdmin === true,
  });

  async function handleLogout() {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/admin-access" });
  }

  if (isAdmin === null) {
    return <div className="container-prose py-32 text-center text-muted-foreground">Loading admin dashboard…</div>;
  }

  if (isAdmin === false) {
    return (
      <div className="container-prose py-32 text-center">
        <h1 className="display-section">Access denied</h1>
        <p className="mt-4 text-muted-foreground">
          Your account does not have administrator privileges. Sign in with an admin account.
        </p>
        <button onClick={handleLogout} className="btn-primary btn-primary-hover mt-8">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    );
  }

  const quotes = quotesQ.data ?? [];
  const contacts = contactsQ.data ?? [];

  // Build monthly chart from quotes
  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    quotes.forEach((q) => {
      const d = new Date(q.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    const sorted = [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6);
    return sorted.map(([k, v]) => ({ m: k.slice(5), quotes: v }));
  }, [quotes]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    quotes.forEach((q) => {
      if (q.product_name) map.set(q.product_name, (map.get(q.product_name) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [quotes]);

  async function changeQuoteStatus(id: string, status: QuoteStatus) {
    try {
      await updQuote({ data: { id, status } });
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin-quotes"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function changeContactStatus(id: string, status: "new" | "read" | "archived") {
    try {
      await updContact({ data: { id, status } });
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function removeQuote(id: string) {
    if (!confirm("Delete this quote request? This cannot be undone.")) return;
    try {
      await delQuote({ data: { id } });
      toast.success("Quote deleted");
      qc.invalidateQueries({ queryKey: ["admin-quotes"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function removeContact(id: string) {
    if (!confirm("Delete this contact submission?")) return;
    try {
      await delContact({ data: { id } });
      toast.success("Contact deleted");
      qc.invalidateQueries({ queryKey: ["admin-contacts"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  const TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "quotes", label: `Quote Requests (${quotes.length})`, icon: FileText },
    { id: "contacts", label: `Contact Forms (${contacts.length})`, icon: Mail },
    { id: "products", label: "Products", icon: Package },
  ] as const;

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
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-foreground text-background" : "text-foreground/75 hover:bg-muted"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/60 hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>

        <main className="space-y-6">
          {tab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Total quote requests" value={quotes.length} />
                <Stat label="Contact submissions" value={contacts.length} />
                <Stat label="Products in catalogue" value={PRODUCTS.length} />
                <Stat
                  label="New (unactioned) quotes"
                  value={quotes.filter((q) => q.status === "new").length}
                />
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-card p-6">
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Monthly inquiries
                </h3>
                <div className="mt-4 h-72">
                  {monthly.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No quote data yet. Submit a quote from a product page to see analytics.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthly}>
                        <defs>
                          <linearGradient id="qg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.62 0.14 145)" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="oklch(0.62 0.14 145)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
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
                <Panel title="Most requested products">
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

                <Panel title="Recent activity">
                  <ul className="divide-y divide-foreground/10">
                    {[...quotes.slice(0, 3).map((q) => ({
                      type: "Quote", text: `${q.name} — ${q.product_name ?? "General"}`, date: q.created_at,
                    })), ...contacts.slice(0, 3).map((c) => ({
                      type: "Contact", text: `${c.name} — ${c.subject ?? "Message"}`, date: c.created_at,
                    }))]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .slice(0, 6)
                      .map((a, i) => (
                        <li key={i} className="flex items-center justify-between py-3 text-sm">
                          <div>
                            <span className="mr-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                              {a.type}
                            </span>
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
              {quotesQ.isLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
              ) : quotes.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No quote requests yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 pr-4">Product</th>
                        <th className="pb-3 pr-4">Customer</th>
                        <th className="pb-3 pr-4">Contact</th>
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                      {quotes.map((q) => (
                        <tr key={q.id} className="align-top">
                          <td className="py-3 pr-4">
                            <p className="font-semibold">{q.product_name ?? "General inquiry"}</p>
                            <p className="text-xs text-muted-foreground">{q.product_category ?? q.division ?? "—"}</p>
                            {q.product_url && (
                              <a href={q.product_url} className="text-xs text-primary hover:underline">View product</a>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <p className="font-semibold">{q.name}</p>
                            <p className="text-xs text-muted-foreground">{q.company ?? "—"}</p>
                            {q.country && <p className="text-xs text-muted-foreground">{q.country}</p>}
                          </td>
                          <td className="py-3 pr-4">
                            <a href={`mailto:${q.email}`} className="text-primary hover:underline">{q.email}</a>
                            {q.phone && <p className="text-xs text-muted-foreground">{q.phone}</p>}
                          </td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground">{fmtDate(q.created_at)}</td>
                          <td className="py-3 pr-4">
                            <select
                              value={q.status}
                              onChange={(e) => changeQuoteStatus(q.id, e.target.value as QuoteStatus)}
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[q.status] ?? ""}`}
                            >
                              {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {q.details && (
                              <details className="mt-2">
                                <summary className="cursor-pointer text-xs text-muted-foreground">Details</summary>
                                <p className="mt-1 max-w-xs text-xs">{q.details}</p>
                              </details>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => removeQuote(q.id)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          )}

          {tab === "contacts" && (
            <Panel title="Contact submissions">
              {contactsQ.isLoading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
              ) : contacts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No contact messages yet.</p>
              ) : (
                <ul className="divide-y divide-foreground/10">
                  {contacts.map((c) => (
                    <li key={c.id} className="grid gap-3 py-4 md:grid-cols-[1fr_auto]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{c.name}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <a href={`mailto:${c.email}`} className="text-sm text-primary hover:underline">{c.email}</a>
                          {c.phone && <span className="text-xs text-muted-foreground">· {c.phone}</span>}
                        </div>
                        {c.subject && <p className="mt-1 text-sm font-medium">{c.subject}</p>}
                        <p className="mt-1 text-sm text-muted-foreground">{c.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{fmtDate(c.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={c.status}
                          onChange={(e) => changeContactStatus(c.id, e.target.value as "new" | "read" | "archived")}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[c.status] ?? ""}`}
                        >
                          <option value="new">new</option>
                          <option value="read">read</option>
                          <option value="archived">archived</option>
                        </select>
                        <button
                          onClick={() => removeContact(c.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {tab === "products" && (
            <Panel title={`Product catalogue (${PRODUCTS.length})`}>
              <p className="mb-4 text-sm text-muted-foreground">
                <Search className="mr-1 inline h-4 w-4" />
                Full product CMS (add/edit/delete with image upload) ships in the next phase. Current catalogue is shown below for reference.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4">SKU</th>
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Category</th>
                      <th className="pb-3 pr-4">Quote requests</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/10">
                    {PRODUCTS.map((p) => {
                      const count = quotes.filter((q) => q.product_slug === p.slug).length;
                      return (
                        <tr key={p.slug}>
                          <td className="py-3 pr-4 font-mono text-xs">{p.sku}</td>
                          <td className="py-3 pr-4 font-semibold">{p.name}</td>
                          <td className="py-3 pr-4">{p.category}</td>
                          <td className="py-3 pr-4">
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              {count}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </main>
      </div>
    </div>
  );
}

function fmtDate(s: string) {
  return new Date(s).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
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
