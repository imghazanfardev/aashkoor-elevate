import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

export function OfficialDistributor() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-foreground)] text-background">
      {/* Ambient gradient accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <div className="container-prose relative py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              Official Distributor
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-6xl"
            >
              Official Distributor of{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Vantec Valves
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-background/75"
            >
              AASHKOOR is the official distributor of Vantec Valves, delivering high-quality
              industrial valve solutions for commercial and industrial applications. We provide
              reliable, certified products backed by technical expertise and exceptional customer
              support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/valves"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_18px_50px_-18px_rgba(255,255,255,0.35)] transition-transform hover:-translate-y-0.5"
              >
                Explore Vantec Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-background/25 px-6 py-3.5 text-sm font-semibold text-background/90 transition-colors hover:border-background/60 hover:text-background"
              >
                Talk to our valve team
              </Link>
            </motion.div>
          </div>

          {/* Right: credentials card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl border border-background/10 bg-background/[0.04] p-8 backdrop-blur-xl">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-background/60">Authorised Partner</span>
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-5 font-display text-3xl font-bold tracking-tight">
                  Vantec × AASHKOOR
                </div>
                <p className="mt-2 text-sm text-background/65">
                  Certified supply chain. Technical support. Full traceability on every valve
                  shipped.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { label: "Certified", value: "100%" },
                    { label: "Product lines", value: "15+" },
                    { label: "Lead time", value: "Fast" },
                    { label: "Support", value: "24/7" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl border border-background/10 bg-background/[0.03] p-4"
                    >
                      <div className="font-display text-2xl font-bold text-primary">{s.value}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-wider text-background/55">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-background/60">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Genuine Vantec products only — sourced and shipped by AASHKOOR.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
