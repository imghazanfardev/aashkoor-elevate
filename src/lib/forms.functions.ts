import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const quoteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(120).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  division: z.string().trim().max(120).optional().or(z.literal("")),
  details: z.string().trim().max(4000).optional().or(z.literal("")),
  product_slug: z.string().trim().max(200).optional().or(z.literal("")),
  product_name: z.string().trim().max(300).optional().or(z.literal("")),
  product_category: z.string().trim().max(120).optional().or(z.literal("")),
  product_url: z.string().trim().max(500).optional().or(z.literal("")),
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
      country: data.country || null,
      industry: data.industry || null,
      division: data.division || null,
      details: data.details || null,
      product_slug: data.product_slug || null,
      product_name: data.product_name || null,
      product_category: data.product_category || null,
      product_url: data.product_url || null,
      status: "new",
    });
    if (error) {
      console.error("submitQuote error:", error);
      throw new Error("Could not submit quote. Please try again.");
    }
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
      status: "new",
    });
    if (error) {
      console.error("submitContact error:", error);
      throw new Error("Could not send message. Please try again.");
    }
    return { ok: true as const };
  });

// ===== Admin server functions =====
// Helper avoids strict SupabaseClient typing by using a minimal duck-typed shape.

type AdminContext = {
  supabase: {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
    from: (table: string) => {
      select: (cols: string) => {
        order: (col: string, opts: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
      update: (vals: Record<string, unknown>) => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
      delete: () => {
        eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
      };
    };
  };
  userId: string;
};

async function assertAdmin(ctx: AdminContext) {
  const { data, error } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden: admin role required");
}

export type QuoteRow = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  industry: string | null;
  division: string | null;
  details: string | null;
  product_slug: string | null;
  product_name: string | null;
  product_category: string | null;
  product_url: string | null;
  status: string;
  created_at: string;
  admin_notes: string | null;
};

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  archived: boolean;
  created_at: string;
};

export const listQuotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as AdminContext);
    const res = await (context as unknown as AdminContext).supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (res.error) throw new Error(res.error.message);
    return (res.data ?? []) as QuoteRow[];
  });

export const listContacts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as AdminContext);
    const res = await (context as unknown as AdminContext).supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (res.error) throw new Error(res.error.message);
    return (res.data ?? []) as ContactRow[];
  });

const statusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "quoted", "won", "closed"]),
  admin_notes: z.string().max(4000).optional(),
});

export const updateQuoteStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => statusUpdateSchema.parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as AdminContext;
    await assertAdmin(ctx);
    const res = await ctx.supabase
      .from("quote_requests")
      .update({ status: data.status, admin_notes: data.admin_notes ?? null })
      .eq("id", data.id);
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });

const contactStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "read", "archived"]),
});

export const updateContactStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => contactStatusSchema.parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as AdminContext;
    await assertAdmin(ctx);
    const res = await ctx.supabase
      .from("contact_submissions")
      .update({ status: data.status, archived: data.status === "archived" })
      .eq("id", data.id);
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });

const deleteSchema = z.object({ id: z.string().uuid() });

export const deleteQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => deleteSchema.parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as AdminContext;
    await assertAdmin(ctx);
    const res = await ctx.supabase.from("quote_requests").delete().eq("id", data.id);
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });

export const deleteContact = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => deleteSchema.parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as AdminContext;
    await assertAdmin(ctx);
    const res = await ctx.supabase.from("contact_submissions").delete().eq("id", data.id);
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });
