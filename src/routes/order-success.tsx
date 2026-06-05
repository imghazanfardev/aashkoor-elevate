import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" ? search.order : "",
  }),
  head: () => ({
    meta: [
      { title: "Order received — AASHKOOR" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { order } = Route.useSearch();
  return (
    <div className="container-prose flex flex-col items-center py-32 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 16, stiffness: 220 }}
        className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        <CheckCircle2 className="h-12 w-12" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="display-section mt-8"
      >
        Thank you — your order is in.
      </motion.h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Our sales engineering team will review your request and respond with a tailored proposal
        within two business days.
      </p>
      {order && (
        <div className="mt-8 rounded-2xl border border-foreground/10 bg-card px-8 py-5 text-left">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Order reference</p>
          <p className="mt-1 font-display text-2xl font-bold tracking-tight">{order}</p>
        </div>
      )}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link to="/products" className="btn-primary btn-primary-hover">
          Continue browsing
        </Link>
        <Link to="/" className="btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
