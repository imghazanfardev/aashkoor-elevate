import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitQuote } from "@/lib/forms.functions";
import { Reveal } from "@/components/site/Section";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Request a Quote — AASHKOOR" },
      { name: "description", content: "Brief our engineering team and receive a tailored proposal." },
      { property: "og:title", content: "Request a Quote — AASHKOOR" },
      { property: "og:description", content: "Get a tailored proposal within two business days." },
      { property: "og:url", content: "/quote" },
    ],
    links: [{ rel: "canonical", href: "/quote" }],
  }),
  component: QuotePage,
});

type Form = {
  name: string; company: string; email: string; phone: string;
  industry: string; division: string; products: string; budget: string; details: string;
};

const EMPTY: Form = {
  name: "", company: "", email: "", phone: "",
  industry: "", division: "", products: "", budget: "", details: "",
};

const DIVISIONS = ["HVAC", "Agriculture", "General Valves", "Industrial Insulation", "Multiple / Not sure"];
const BUDGETS = ["Under $10k", "$10k – $50k", "$50k – $250k", "$250k – $1M", "$1M+"];

function QuotePage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitQuote);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const steps = [
    {
      title: "Your details",
      valid: form.name.trim() && /.+@.+\..+/.test(form.email),
      content: (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name *" value={form.name} onChange={update("name")} />
          <Field label="Company" value={form.company} onChange={update("company")} />
          <Field label="Email *" type="email" value={form.email} onChange={update("email")} />
          <Field label="Phone" value={form.phone} onChange={update("phone")} />
        </div>
      ),
    },
    {
      title: "About your project",
      valid: !!form.division,
      content: (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Industry" value={form.industry} onChange={update("industry")} placeholder="e.g. Oil & Gas, Real estate" />
          <SelectField label="Division of interest *" value={form.division} onChange={update("division")} options={DIVISIONS} />
          <SelectField label="Approximate budget" value={form.budget} onChange={update("budget")} options={BUDGETS} />
          <Field label="Products / services needed" value={form.products} onChange={update("products")} />
        </div>
      ),
    },
    {
      title: "Project details",
      valid: true,
      content: (
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-foreground/80">Tell us about the project</span>
            <textarea
              value={form.details}
              onChange={update("details")}
              rows={6}
              className="rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              placeholder="Scope, timeline, location, key constraints…"
            />
          </label>
        </div>
      ),
    },
  ];

  const current = steps[step];

  async function onSubmit() {
    try {
      setSubmitting(true);
      await submit({ data: form });
      toast.success("Quote request received — we'll be in touch within 2 business days.");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[var(--color-surface)] py-20 md:py-28">
      <div className="container-prose grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="eyebrow">Request a quote</p>
          <h1 className="display-section mt-4 text-balance">
            Brief our team in a few minutes.
          </h1>
          <p className="mt-5 text-muted-foreground">
            Tell us a little about the project — our engineers will respond with a tailored
            proposal within two business days.
          </p>
          <ul className="mt-10 space-y-3 text-sm">
            {["No-cost proposal", "Senior engineer assigned to your brief", "Confidential & secure"].map((b) => (
              <li key={b} className="flex items-center gap-2 text-foreground/80">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-card p-7 shadow-[var(--shadow-soft)] md:p-10">
            <div className="mb-8 flex items-center gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? "bg-primary" : "bg-foreground/10"
                  }`}
                />
              ))}
            </div>
            <h2 className="font-display text-xl font-bold md:text-2xl">{current.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Step {step + 1} of {steps.length}
            </p>
            <div className="mt-8">{current.content}</div>

            <div className="mt-10 flex items-center justify-between">
              <button
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="btn-ghost disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  disabled={!current.valid}
                  onClick={() => setStep((s) => s + 1)}
                  className="btn-primary btn-primary-hover disabled:opacity-50"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  disabled={submitting}
                  onClick={onSubmit}
                  className="btn-primary btn-primary-hover disabled:opacity-50"
                >
                  {submitting ? "Submitting…" : "Submit request"} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: readonly string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-foreground/80">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
