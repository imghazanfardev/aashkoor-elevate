import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const quoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  division: z.string().trim().max(120).optional().or(z.literal("")),
  products: z.string().trim().max(1000).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  details: z.string().trim().max(4000).optional().or(z.literal("")),
});

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(4000),
});

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => quoteSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("quote_requests").insert({
      name: data.name,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      industry: data.industry || null,
      division: data.division || null,
      products: data.products || null,
      budget: data.budget || null,
      details: data.details || null,
    });
    if (error) throw new Error("Could not submit quote. Please try again.");
    return { ok: true as const };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
    });
    if (error) throw new Error("Could not send message. Please try again.");
    return { ok: true as const };
  });
