import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset Password — AASHKOOR" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase appends tokens in the URL hash; the client picks it up automatically
    // and fires a PASSWORD_RECOVERY event. Wait for a session before allowing reset.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. Redirecting to admin…");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-prose grid min-h-[80vh] place-items-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <KeyRound className="h-10 w-10 text-primary" />
        <h1 className="display-section mt-6">Set a new password.</h1>
        <p className="mt-3 text-muted-foreground">
          {ready
            ? "Choose a strong password (min 8 characters)."
            : "Verifying your reset link…"}
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              New password
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={!ready}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confirm password
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="field-input"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={!ready}
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={busy || !ready}
            className="btn-primary btn-primary-hover w-full disabled:opacity-50"
          >
            {busy ? "Updating…" : "Update password"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <style>{`
          .field-input { width: 100%; height: 48px; border-radius: 12px; border: 1px solid color-mix(in oklab, var(--foreground) 15%, transparent); padding: 0 1rem 0 2.5rem; font-size: 0.95rem; background: var(--background); }
          .field-input:focus { outline: none; border-color: var(--color-primary); }
        `}</style>
      </motion.div>
    </div>
  );
}
