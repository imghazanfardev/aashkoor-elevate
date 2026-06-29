import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-access")({
  head: () => ({
    meta: [
      { title: "Admin Access — AASHKOOR" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminAccessPage,
});

function AdminAccessPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in…");
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          toast.message("Check your email to confirm, then sign in.");
          setMode("signin");
          return;
        }
        navigate({ to: "/admin" });
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent. Check your email.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-prose grid min-h-[80vh] gap-12 py-16 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between rounded-3xl bg-foreground p-12 text-background">
        <p className="eyebrow text-background/60">Administrator access</p>
        <div>
          <ShieldCheck className="h-10 w-10 text-primary" />
          <h1 className="display-section mt-6 text-balance">Restricted area.</h1>
          <p className="mt-6 max-w-md text-background/70">
            This portal is for AASHKOOR administrators only. All access is logged.
            Unauthorized use is prohibited.
          </p>
        </div>
        <div className="rounded-2xl border border-background/15 bg-background/5 p-5 text-sm text-background/80">
          <p className="font-semibold text-background">First-time setup</p>
          <p className="mt-2 text-background/70">
            Register the seeded admin email <code className="rounded bg-background/10 px-1.5 py-0.5">admin@aashkoor.com</code> with a password of your choice. The system automatically grants admin privileges to that email.
          </p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center">
        <div className="inline-flex w-fit rounded-full border border-foreground/15 p-1 text-sm">
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMode(t)}
              className={`rounded-full px-4 py-2 font-semibold transition-colors ${
                mode === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "signin" ? "Admin sign in" : "Register admin"}
            </button>
          ))}
        </div>

        <h2 className="display-section mt-6">
          {mode === "signin"
            ? "Sign in to dashboard."
            : mode === "signup"
            ? "Create admin account."
            : "Reset your password."}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {mode === "signin"
            ? "Enter your administrator credentials."
            : mode === "signup"
            ? "Use admin@aashkoor.com for auto-granted admin privileges."
            : "Enter your admin email — we'll send you a reset link."}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field icon={<Mail className="h-4 w-4" />} label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="admin@aashkoor.com"
              autoComplete="email"
            />
          </Field>
          {mode !== "forgot" && (
            <Field icon={<Lock className="h-4 w-4" />} label="Password">
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </Field>
          )}

          <button type="submit" disabled={busy} className="btn-primary btn-primary-hover w-full disabled:opacity-50">
            {busy
              ? "Working…"
              : mode === "signin"
              ? "Sign in"
              : mode === "signup"
              ? "Create account"
              : "Send reset link"}
            <ArrowRight className="h-4 w-4" />
          </button>

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Forgot password?
            </button>
          )}
          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Back to sign in
            </button>
          )}
        </form>
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
