import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const BASE_URL = "";

interface SitemapEntry { path: string; changefreq?: string; priority?: string; }

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/valves", changefreq: "weekly", priority: "0.9" },
          { path: "/industrial-insulation", changefreq: "weekly", priority: "0.9" },
          { path: "/products", changefreq: "weekly", priority: "0.85" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/contact", changefreq: "yearly", priority: "0.6" },
          { path: "/quote", changefreq: "yearly", priority: "0.6" },
        ];

        try {
          const supabase = createClient<Database>(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
          );
          const [{ data: products }, { data: posts }] = await Promise.all([
            supabase.from("products").select("slug").eq("status", "published"),
            supabase.from("blog_posts").select("slug").eq("status", "published"),
          ]);
          for (const p of products ?? []) entries.push({ path: `/products/${p.slug}`, changefreq: "weekly", priority: "0.7" });
          for (const p of posts ?? []) entries.push({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.6" });
        } catch (e) {
          console.error("sitemap dynamic fetch failed", e);
        }

        const urls = entries.map((e) =>
          `  <url><loc>${BASE_URL}${e.path}</loc>${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}${e.priority ? `<priority>${e.priority}</priority>` : ""}</url>`
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
