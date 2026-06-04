import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell, Download, FileText, Heart, History, LayoutDashboard, LogIn, Settings, User,
} from "lucide-react";
import { useDemoAuth } from "@/lib/stores/auth";
import { useWishlist } from "@/lib/stores/wishlist";
import { PRODUCTS } from "@/lib/data/products";
import { money } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "My Dashboard — AASHKOOR" }, { name: "description", content: "Customer dashboard" }],
  }),
  component: DashboardPage,
});

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "saved", label: "Saved products", icon: Heart },
  { id: "quotes", label: "My quotes", icon: FileText },
  { id: "history", label: "Inquiry history", icon: History },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const SAMPLE_QUOTES = [
  { id: "Q-2615", date: "12 May 2026", items: 8, total: 14820, status: "Awaiting proposal" },
  { id: "Q-2604", date: "03 May 2026", items: 3, total: 4230, status: "Proposal sent" },
  { id: "Q-2588", date: "21 Apr 2026", items: 12, total: 28100, status: "Won" },
  { id: "Q-2571", date: "08 Apr 2026", items: 2, total: 1180, status: "Closed" },
];
const SAMPLE_HISTORY = [
  { date: "12 May", event: "Quote Q-2615 submitted", detail: "8 items · Valves + Insulation" },
  { date: "10 May", event: "Datasheet downloaded", detail: "Gate Valve DN100 spec" },
  { date: "06 May", event: "Quote Q-2604 proposal received", detail: "Estimated 9-week lead time" },
  { date: "21 Apr", event: "Quote Q-2588 marked Won", detail: "Project: Atlas Refinery" },
];
const SAMPLE_NOTIFICATIONS = [
  { title: "Proposal ready", body: "Q-2604 — your AASHKOOR proposal is available.", time: "2h ago", unread: true },
  { title: "Datasheet updated", body: "Rockwool Insulation Slab v2.4 published.", time: "1d ago", unread: true },
  { title: "Project milestone", body: "Skyline Tower phase 2 commissioning scheduled.", time: "3d ago" },
];

function DashboardPage() {
  const user = useDemoAuth((s) => s.user);
  const wishlist = useWishlist((s) => s.slugs);
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.slug));
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");

  if (!user) {
    return (
      <div className="container-prose py-24 text-center">
        <h1 className="display-section">Sign in to view your dashboard</h1>
        <p className="mt-4 text-muted-foreground">Manage saved products, quotes and project notifications.</p>
        <Link to="/auth" className="btn-primary btn-primary-hover mt-8 inline-flex">
          <LogIn className="h-4 w-4" /> Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="container-prose grid gap-8 py-12 lg:grid-cols-[260px_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-foreground/10 bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
        <nav className="mt-4 flex flex-row gap-1 overflow-x-auto rounded-2xl border border-foreground/10 bg-card p-2 lg:flex-col lg:overflow-visible">
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

      <main>
        {tab === "overview" && (
          <div>
            <h1 className="display-section">Welcome back, {user.name.split(" ")[0]}.</h1>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Open quotes", value: 2, icon: FileText },
                { label: "Saved products", value: savedProducts.length, icon: Heart },
                { label: "Downloads", value: 14, icon: Download },
                { label: "Notifications", value: 3, icon: Bell },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-foreground/10 bg-card p-5">
                  <s.icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 font-display text-3xl font-bold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Card title="Recent quotes">
                <ul className="divide-y divide-foreground/10">
                  {SAMPLE_QUOTES.slice(0, 3).map((q) => (
                    <li key={q.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-semibold">{q.id}</p>
                        <p className="text-xs text-muted-foreground">{q.date} · {q.items} items</p>
                      </div>
                      <span className="text-sm font-semibold">{money(q.total)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="Recent activity">
                <ul className="space-y-3 text-sm">
                  {SAMPLE_HISTORY.slice(0, 4).map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-12 shrink-0 text-xs text-muted-foreground">{h.date}</span>
                      <span><span className="font-medium">{h.event}</span> — <span className="text-muted-foreground">{h.detail}</span></span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}

        {tab === "saved" && (
          <Card title={`Saved products (${savedProducts.length})`}>
            {savedProducts.length === 0 ? (
              <p className="text-muted-foreground">No saved products yet. <Link to="/products" className="text-primary font-semibold">Browse catalogue</Link></p>
            ) : (
              <ul className="divide-y divide-foreground/10">
                {savedProducts.map((p) => (
                  <li key={p.slug} className="flex items-center gap-4 py-4">
                    <img src={p.image} alt="" className="h-14 w-14 rounded-lg bg-[var(--color-surface)] object-contain p-1" />
                    <div className="flex-1">
                      <Link to="/products/$slug" params={{ slug: p.slug }} className="font-semibold hover:text-primary">{p.name}</Link>
                      <p className="text-xs text-muted-foreground">{p.category} · {p.sku}</p>
                    </div>
                    <span className="font-semibold">{money(p.price)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {tab === "quotes" && (
          <Card title="My quotes">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3">Quote</th><th className="pb-3">Date</th><th className="pb-3">Items</th><th className="pb-3">Total</th><th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {SAMPLE_QUOTES.map((q) => (
                  <tr key={q.id}>
                    <td className="py-3 font-semibold">{q.id}</td>
                    <td className="py-3 text-muted-foreground">{q.date}</td>
                    <td className="py-3">{q.items}</td>
                    <td className="py-3 font-semibold">{money(q.total)}</td>
                    <td className="py-3"><Badge>{q.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {tab === "history" && (
          <Card title="Inquiry history">
            <ol className="relative space-y-6 border-l border-foreground/10 pl-6">
              {SAMPLE_HISTORY.map((h, i) => (
                <li key={i}>
                  <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-primary" />
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                  <p className="font-semibold">{h.event}</p>
                  <p className="text-sm text-muted-foreground">{h.detail}</p>
                </li>
              ))}
            </ol>
          </Card>
        )}

        {tab === "downloads" && (
          <Card title="Downloads">
            <ul className="divide-y divide-foreground/10">
              {PRODUCTS.slice(0, 6).flatMap((p) => p.downloads.map((d) => ({ ...d, p }))).map((d, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{d.label}</p>
                    <p className="text-xs text-muted-foreground">{d.p.name}</p>
                  </div>
                  <a href={d.href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><Download className="h-4 w-4" /> Download</a>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {tab === "notifications" && (
          <Card title="Notifications">
            <ul className="divide-y divide-foreground/10">
              {SAMPLE_NOTIFICATIONS.map((n, i) => (
                <li key={i} className="flex items-start gap-4 py-4">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-primary" : "bg-foreground/20"}`} />
                  <div className="flex-1">
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {tab === "profile" && (
          <Card title="Profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" defaultValue={user.name} />
              <Field label="Email" defaultValue={user.email} />
              <Field label="Company" defaultValue="AASHKOOR Demo Co." />
              <Field label="Phone" defaultValue="+971 50 000 0000" />
            </div>
            <button className="btn-primary btn-primary-hover mt-6">Save changes</button>
          </Card>
        )}

        {tab === "settings" && (
          <Card title="Account settings">
            <Toggle label="Email notifications" defaultChecked />
            <Toggle label="Quote status updates" defaultChecked />
            <Toggle label="Product newsletter" />
          </Card>
        )}
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-foreground/10 bg-card p-6">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{children}</span>;
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input defaultValue={defaultValue} className="h-11 w-full rounded-lg border border-foreground/15 bg-background px-3 text-sm focus:border-primary focus:outline-none" />
    </label>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between border-b border-foreground/10 py-4 last:border-0">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={() => setOn((s) => !s)}
        className={`h-6 w-11 rounded-full p-0.5 transition-colors ${on ? "bg-primary" : "bg-foreground/15"}`}
        aria-pressed={on}
      >
        <span className={`block h-5 w-5 rounded-full bg-background transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
