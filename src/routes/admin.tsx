import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3, Briefcase, FileText, Image, LayoutDashboard, LogIn, Mail, Newspaper, Package, Settings, Users,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { useDemoAuth } from "@/lib/stores/auth";
import { PRODUCTS } from "@/lib/data/products";
import { money } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — AASHKOOR" }] }),
  component: AdminPage,
});

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "leads", label: "Leads", icon: Mail },
  { id: "users", label: "Users", icon: Users },
  { id: "blog", label: "Blog", icon: Newspaper },
  { id: "careers", label: "Careers", icon: Briefcase },
  { id: "media", label: "Media", icon: Image },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const REVENUE = [
  { m: "Jan", revenue: 142000, quotes: 38 },
  { m: "Feb", revenue: 168000, quotes: 42 },
  { m: "Mar", revenue: 201000, quotes: 51 },
  { m: "Apr", revenue: 187000, quotes: 47 },
  { m: "May", revenue: 234000, quotes: 58 },
  { m: "Jun", revenue: 272000, quotes: 64 },
];
const TOP_PRODUCTS = [
  { name: "Gate Valve DN100", units: 412 },
  { name: "Rockwool Slab", units: 386 },
  { name: "Ball Valve DN50", units: 318 },
  { name: "Fiberglass Roll", units: 244 },
  { name: "Butterfly Valve DN200", units: 198 },
];
const CATEGORY_MIX = [
  { name: "Valves", value: 46 },
  { name: "Insulation", value: 31 },
  { name: "HVAC", value: 18 },
  { name: "Agriculture", value: 5 },
];
const SAMPLE_QUOTES = [
  { id: "Q-2615", customer: "Skyline Holdings", date: "12 May", total: 14820, status: "New", assigned: "Sara K." },
  { id: "Q-2604", customer: "Atlas Refinery", date: "03 May", total: 24230, status: "In review", assigned: "Mark T." },
  { id: "Q-2588", customer: "Northport Logistics", date: "21 Apr", total: 38100, status: "Sent", assigned: "Sara K." },
  { id: "Q-2571", customer: "Delta Farms", date: "08 Apr", total: 11180, status: "Won", assigned: "Lina F." },
  { id: "Q-2562", customer: "Mercury Steel", date: "01 Apr", total: 9450, status: "Lost", assigned: "Mark T." },
];
const SAMPLE_LEADS = [
  { name: "Ahmed Al-Khateeb", company: "Vertex Group", subject: "RFQ — Cooling tower", date: "Today" },
  { name: "Maria Lopez", company: "Andes Cold Chain", subject: "Insulation supply enquiry", date: "Yesterday" },
  { name: "Yuki Tanaka", company: "Pacific Plants", subject: "Annual valve framework", date: "2d" },
];
const SAMPLE_USERS = [
  { name: "Sara Karim", email: "sara@aashkoor.com", role: "Admin", status: "Active" },
  { name: "Mark Theron", email: "mark@aashkoor.com", role: "Editor", status: "Active" },
  { name: "Lina Farouk", email: "lina@aashkoor.com", role: "Sales", status: "Active" },
  { name: "Vendor — Acme", email: "ops@acme.co", role: "Customer", status: "Active" },
];

const COLORS = ["oklch(0.62 0.14 145)", "oklch(0.36 0.07 240)", "oklch(0.7 0.14 145)", "oklch(0.78 0.16 75)"];

function AdminPage() {
  const user = useDemoAuth((s) => s.user);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");

  if (!user) {
    return (
      <div className="container-prose py-24 text-center">
        <h1 className="display-section">Admin access required</h1>
        <p className="mt-4 text-muted-foreground">Sign in with an email starting with <code className="rounded bg-muted px-1.5">admin@</code> to preview the admin dashboard.</p>
        <Link to="/auth" className="btn-primary btn-primary-hover mt-8 inline-flex"><LogIn className="h-4 w-4" /> Sign in</Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] min-h-screen">
      <div className="container-prose grid gap-8 py-12 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-primary px-2">Admin</p>
          <nav className="mt-3 flex flex-row gap-1 overflow-x-auto rounded-2xl border border-foreground/10 bg-card p-2 lg:flex-col">
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
          </nav>
        </aside>

        <main className="space-y-6">
          {tab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Monthly revenue", value: money(272000), delta: "+15.4%" },
                  { label: "Quotes (MTD)", value: "64", delta: "+10.3%" },
                  { label: "Leads", value: "118", delta: "+22.0%" },
                  { label: "Conversion", value: "41%", delta: "+2.1%" },
                ].map((k) => (
                  <div key={k.label} className="rounded-2xl border border-foreground/10 bg-card p-5">
                    <p className="text-sm text-muted-foreground">{k.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold">{k.value}</p>
                    <p className="mt-1 text-xs font-semibold text-primary">{k.delta} vs last month</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-foreground/10 bg-card p-6 lg:col-span-2">
                  <h3 className="font-display text-lg font-bold">Revenue & quotes</h3>
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE}>
                        <defs>
                          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.62 0.14 145)" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="oklch(0.62 0.14 145)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                        <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="oklch(0.62 0.14 145)" fill="url(#rev)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-card p-6">
                  <h3 className="font-display text-lg font-bold">Category mix</h3>
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={CATEGORY_MIX} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                          {CATEGORY_MIX.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-foreground/10 bg-card p-6">
                  <h3 className="font-display text-lg font-bold">Top products</h3>
                  <div className="mt-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={TOP_PRODUCTS} layout="vertical">
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} />
                        <Tooltip />
                        <Bar dataKey="units" fill="oklch(0.36 0.07 240)" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/10 bg-card p-6">
                  <h3 className="font-display text-lg font-bold">Recent quotes</h3>
                  <ul className="mt-4 divide-y divide-foreground/10">
                    {SAMPLE_QUOTES.slice(0, 5).map((q) => (
                      <li key={q.id} className="flex items-center justify-between py-3 text-sm">
                        <div>
                          <p className="font-semibold">{q.id} · {q.customer}</p>
                          <p className="text-xs text-muted-foreground">{q.date} · {q.assigned}</p>
                        </div>
                        <span className="font-semibold">{money(q.total)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {tab === "products" && (
            <Panel title="Product management" actionLabel="Add product">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3">SKU</th><th className="pb-3">Name</th><th className="pb-3">Category</th><th className="pb-3">Price</th><th className="pb-3">Stock</th><th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  {PRODUCTS.map((p) => (
                    <tr key={p.slug}>
                      <td className="py-3 font-mono text-xs">{p.sku}</td>
                      <td className="py-3 font-semibold">{p.name}</td>
                      <td className="py-3">{p.category}</td>
                      <td className="py-3">{money(p.price)}</td>
                      <td className="py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.inStock ? "bg-primary/10 text-primary" : "bg-warning/15 text-foreground/70"}`}>{p.inStock ? "In stock" : "Lead time"}</span></td>
                      <td className="py-3 text-right"><button className="text-sm text-primary font-semibold">Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}

          {tab === "quotes" && (
            <Panel title="Quote management" actionLabel="Export">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="pb-3">Quote</th><th className="pb-3">Customer</th><th className="pb-3">Date</th><th className="pb-3">Total</th><th className="pb-3">Status</th><th className="pb-3">Assigned</th></tr></thead>
                <tbody className="divide-y divide-foreground/10">
                  {SAMPLE_QUOTES.map((q) => (
                    <tr key={q.id}>
                      <td className="py-3 font-semibold">{q.id}</td>
                      <td className="py-3">{q.customer}</td>
                      <td className="py-3 text-muted-foreground">{q.date}</td>
                      <td className="py-3 font-semibold">{money(q.total)}</td>
                      <td className="py-3"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{q.status}</span></td>
                      <td className="py-3">{q.assigned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}

          {tab === "leads" && (
            <Panel title="Lead management">
              <ul className="divide-y divide-foreground/10">
                {SAMPLE_LEADS.map((l, i) => (
                  <li key={i} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-semibold">{l.name} · <span className="text-muted-foreground font-normal">{l.company}</span></p>
                      <p className="text-sm text-muted-foreground">{l.subject}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{l.date}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {tab === "users" && (
            <Panel title="User management" actionLabel="Invite user">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Status</th></tr></thead>
                <tbody className="divide-y divide-foreground/10">
                  {SAMPLE_USERS.map((u) => (
                    <tr key={u.email}><td className="py-3 font-semibold">{u.name}</td><td className="py-3">{u.email}</td><td className="py-3">{u.role}</td><td className="py-3"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{u.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}

          {tab === "blog" && (
            <Panel title="Blog management" actionLabel="New article">
              <ul className="divide-y divide-foreground/10">
                {["Designing 12 MW central plants for super-tall towers", "Why API 600 still matters in 2026", "Energy-recovery in cold-chain warehouses"].map((t, i) => (
                  <li key={i} className="flex items-center justify-between py-4"><span className="font-semibold">{t}</span><span className="text-xs text-muted-foreground">Published</span></li>
                ))}
              </ul>
            </Panel>
          )}

          {tab === "careers" && (
            <Panel title="Careers" actionLabel="Post job">
              <ul className="divide-y divide-foreground/10">
                {[
                  { title: "Senior HVAC Engineer", apps: 14 },
                  { title: "Procurement Lead — Valves", apps: 8 },
                  { title: "Project Manager — Insulation", apps: 11 },
                ].map((j) => (
                  <li key={j.title} className="flex items-center justify-between py-4"><span className="font-semibold">{j.title}</span><span className="text-sm text-muted-foreground">{j.apps} applications</span></li>
                ))}
              </ul>
            </Panel>
          )}

          {tab === "media" && (
            <Panel title="Media library" actionLabel="Upload">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PRODUCTS.slice(0, 8).map((p) => (
                  <div key={p.slug} className="aspect-square overflow-hidden rounded-xl bg-[var(--color-surface)]">
                    <img src={p.image} alt="" className="h-full w-full object-contain p-3" />
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {tab === "reports" && (
            <Panel title="Reports & analytics" actionLabel="Export PDF">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0 0)" />
                    <XAxis dataKey="m" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="quotes" fill="oklch(0.62 0.14 145)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          )}

          {tab === "settings" && (
            <Panel title="Settings">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company name" defaultValue="AASHKOOR" />
                <Field label="Support email" defaultValue="hello@aashkoor.com" />
                <Field label="Phone" defaultValue="+971 50 000 0000" />
                <Field label="HQ address" defaultValue="Industrial HQ, Global Operations" />
              </div>
              <button className="btn-primary btn-primary-hover mt-6">Save</button>
            </Panel>
          )}
        </main>
      </div>
    </div>
  );
}

function Panel({ title, actionLabel, children }: { title: string; actionLabel?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-foreground/10 bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {actionLabel && <button className="btn-primary btn-primary-hover">{actionLabel}</button>}
      </div>
      <div className="mt-5 overflow-x-auto">{children}</div>
    </section>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input defaultValue={defaultValue} className="h-11 w-full rounded-lg border border-foreground/15 bg-background px-3 text-sm focus:border-primary focus:outline-none" />
    </label>
  );
}
