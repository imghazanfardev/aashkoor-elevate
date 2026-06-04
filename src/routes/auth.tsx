import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { useDemoAuth } from "@/lib/stores/auth";
import { toast } from "sonner";

const search = z.object({ tab: fallback(z.enum(["login", "register", "forgot"]), "login").default("login") });

export const Route = createFileRoute("/auth")({
  validateSearch: zodValidator(search),
  head: () => ({
    meta: [
      { title: "Sign in — AASHKOOR" },
      { name: "description", content: "Sign in or create your AASHKOOR enterprise account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const login = useDemoAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (tab === "forgot") {
      toast.success("Reset link sent. Check your inbox.");
      return;
    }
    if (!email) {
      toast.error("Email is required");
      return;
    }
    const role = email.startsWith("admin") ? "admin" : "customer";
    login(email, name || undefined, role);
    toast.success(`Welcome${name ? ", " + name : ""}!`);
    navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
  }

  return (
    <div className="container-prose grid min-h-[80vh] gap-12 py-16 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between rounded-3xl bg-foreground p-12 text-background">
        <p className="eyebrow text-background/60">AASHKOOR Account</p>
        <div>
          <h1 className="display-section text-balance">Your enterprise control room.</h1>
          <p className="mt-6 max-w-md text-background/70">
            Save products, manage quotes, download datasheets and track your projects — all in one premium dashboard.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-background/80">
            {["Saved products & quotes", "Inquiry history & status", "Document downloads", "Project notifications"].map(
              (f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" /> {f}
                </li>
              ),
            )}
          </ul>
        </div>
        <p className="text-xs text-background/50">
          Tip: sign in with an email starting with <code className="rounded bg-background/10 px-1.5 py-0.5">admin@</code> to access the admin dashboard.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-center"
      >
        <div className="inline-flex w-fit rounded-full border border-foreground/15 p-1 text-sm">
          {(["login", "register", "forgot"] as const).map((t) => (
            <Link
              key={t}
              to="/auth"
              search={{ tab: t }}
              className={`rounded-full px-4 py-2 font-semibold transition-colors ${
                tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "login" ? "Sign in" : t === "register" ? "Create account" : "Reset"}
            </Link>
          ))}
        </div>

        <h2 className="display-section mt-6">
          {tab === "login" ? "Welcome back." : tab === "register" ? "Create your account." : "Reset your password."}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {tab === "login"
            ? "Sign in to manage your saved products, quotes and projects."
            : tab === "register"
            ? "Get a premium dashboard tailored to your enterprise."
            : "Enter your email and we'll send a reset link."}
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {tab === "register" && (
            <Field icon={<User className="h-4 w-4" />} label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="field-input" placeholder="Jane Engineer" />
            </Field>
          )}
          <Field icon={<Mail className="h-4 w-4" />} label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="you@company.com"
            />
          </Field>
          {tab !== "forgot" && (
            <Field icon={<Lock className="h-4 w-4" />} label="Password">
              <input type="password" className="field-input" placeholder="••••••••" />
            </Field>
          )}

          <button type="submit" className="btn-primary btn-primary-hover w-full">
            {tab === "login" ? "Sign in" : tab === "register" ? "Create account" : "Send reset link"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground">
          Demo authentication for preview. Full Lovable Cloud auth wires in seamlessly next.
        </p>
      </motion.div>

      <style>{`
        .field-input { width: 100%; height: 48px; border-radius: 12px; border: 1px solid color-mix(in oklab, var(--foreground) 15%, transparent); padding: 0 1rem 0 2.5rem; font-size: 0.95rem; background: var(--background); }
        .field-input:focus { outline: none; border-color: var(--color-primary); }
      `}</style>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
