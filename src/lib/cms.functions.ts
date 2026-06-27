import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

// ---------- Public reads ----------
export const listPublishedProducts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await publicClient()
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ProductRow[];
  },
);

export const getPublishedProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("products").select("*")
      .eq("slug", data.slug).eq("status", "published").maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as ProductRow | null;
  });

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await publicClient()
      .from("blog_posts").select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as BlogPostRow[];
  },
);

export const getPublishedPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("blog_posts").select("*")
      .eq("slug", data.slug).eq("status", "published").maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as BlogPostRow | null;
  });

// ---------- Admin ----------
type Ctx = {
  supabase: ReturnType<typeof createClient<Database>>;
  userId: string;
};

async function assertAdmin(ctx: Ctx) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: admin role required");
}

export const listAllProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as Ctx);
    const { data, error } = await (context as unknown as Ctx).supabase
      .from("products").select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ProductRow[];
  });

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as Ctx);
    const { data, error } = await (context as unknown as Ctx).supabase
      .from("blog_posts").select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as BlogPostRow[];
  });

const specSchema = z.object({ label: z.string(), value: z.string() });
const faqSchema = z.object({ q: z.string(), a: z.string() });

const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "slug must be lowercase, hyphens only"),
  name: z.string().min(1).max(300),
  category: z.enum(["Valves", "Industrial Insulation"]),
  featured_image: z.string().max(1000).optional().nullable(),
  gallery_images: z.array(z.string().max(1000)).default([]),
  short_description: z.string().max(500).optional().nullable(),
  full_description: z.string().max(8000).optional().nullable(),
  specifications: z.array(specSchema).default([]),
  features: z.array(z.string().max(300)).default([]),
  applications: z.array(z.string().max(300)).default([]),
  datasheet_url: z.string().max(1000).optional().nullable(),
  related_product_ids: z.array(z.string().uuid()).default([]),
  faqs: z.array(faqSchema).default([]),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(400).optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().int().default(0),
});

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => productSchema.parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const payload = {
      ...data,
      featured_image: data.featured_image || null,
      short_description: data.short_description || null,
      full_description: data.full_description || null,
      datasheet_url: data.datasheet_url || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
    };
    const { data: row, error } = data.id
      ? await ctx.supabase.from("products").update(payload).eq("id", data.id).select("*").maybeSingle()
      : await ctx.supabase.from("products").insert(payload).select("*").maybeSingle();
    if (error) throw new Error(error.message);
    return row as ProductRow;
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { error } = await ctx.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "slug must be lowercase, hyphens only"),
  title: z.string().min(1).max(300),
  category: z.string().max(120).optional().nullable(),
  featured_image: z.string().max(1000).optional().nullable(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().max(50000).optional().nullable(),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().max(400).optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const upsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => postSchema.parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const payload = {
      ...data,
      category: data.category || null,
      featured_image: data.featured_image || null,
      excerpt: data.excerpt || null,
      content: data.content || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    };
    const { data: row, error } = data.id
      ? await ctx.supabase.from("blog_posts").update(payload).eq("id", data.id).select("*").maybeSingle()
      : await ctx.supabase.from("blog_posts").insert(payload).select("*").maybeSingle();
    if (error) throw new Error(error.message);
    return row as BlogPostRow;
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { error } = await ctx.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
