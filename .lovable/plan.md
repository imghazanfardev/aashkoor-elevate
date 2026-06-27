# Lightweight Admin CMS

Build the simplified admin you described. Quotes, contacts, analytics, and the admin login already exist — I'll extend with **dynamic Products** and **dynamic Blog**, then wire the public pages to the database.

## Admin access (already in place)

- URL: `/admin-access` → sign in → redirects to `/admin`
- The DB trigger `handle_new_user_admin_grant` auto-grants the `admin` role to **`admin@aashkoor.com`** on first signup.
- I cannot create the user for you (Supabase auth signup requires the password be set by you), but you only need to do this once: open `/admin-access`, switch to **Register admin**, register `admin@aashkoor.com` with any password ≥ 8 chars. You'll be logged straight into `/admin`.

Credentials to use:
- **URL:** `/admin-access`
- **Email:** `admin@aashkoor.com`
- **Password:** (you choose at first registration)

## Database (new migration)

Two new tables + one storage bucket. Both restricted: admins write, public reads only `status='published'` rows.

```text
products
  id, slug (unique), name, category ('Valves'|'Industrial Insulation'),
  featured_image, gallery_images[], short_description, full_description,
  specifications (jsonb [{label,value}]), features[], applications[],
  datasheet_url, related_product_ids[], faqs (jsonb [{q,a}]),
  seo_title, seo_description, status ('draft'|'published'),
  sort_order, created_at, updated_at

blog_posts
  id, slug (unique), title, category, featured_image,
  excerpt, content (markdown/plain), seo_title, seo_description,
  status ('draft'|'published'), published_at, created_at, updated_at
```

Storage bucket `product-media` (public read, admin write) for image and PDF uploads.

RLS: anyone (anon) can `SELECT` published rows; only admins can insert/update/delete (via `has_role(auth.uid(),'admin')`).

## Server functions (`src/lib/cms.functions.ts`)

Public (no auth): `listPublishedProducts`, `getPublishedProductBySlug`, `listPublishedPosts`, `getPublishedPostBySlug` — via publishable-key server client.

Admin (`requireSupabaseAuth` + admin check): `listAllProducts/Posts`, `upsertProduct/Post`, `deleteProduct/Post`.

Image/PDF upload happens client-side in the admin form using the Supabase storage client.

## Admin UI changes (`/admin`)

Add two new tabs to existing dashboard:

- **Products** — table list + "New product" button → full form matching the single-product page fields (name, slug, category dropdown [Valves / Industrial Insulation], featured image upload, gallery uploads, short + full description, specs repeater, features list, applications list, datasheet PDF upload, related products multi-select, FAQ repeater, SEO title/description, draft/publish toggle). Edit + delete actions.
- **Blog** — table list + "New post" → form (title, slug, category, featured image, excerpt, content, SEO, draft/publish). Edit + delete.

Overview cards updated to show **dynamic** totals (Products, Posts, Quotes, Contacts).

## Public site rewiring

- `src/routes/products.index.tsx`, `/valves`, `/industrial-insulation`, `/products/$slug` → load from DB via public server fn, no more `PRODUCTS` array.
- `src/routes/blog.tsx` → list published posts from DB.
- New `src/routes/blog.$slug.tsx` → single post page.
- Legacy `src/lib/data/products.ts` deleted (no hardcoded products).
- Sitemap pulls slugs from DB.

## Out of scope (per "keep it simple")

- No rich-text editor — blog content is plain text / markdown in a textarea (renders with line breaks + simple markdown).
- No image cropping, no draft autosave, no scheduled publishing.
- No customer accounts.

## Migration of existing seeded products

The 5 valves + 18 insulation items currently hardcoded will be inserted as published rows in the same migration, so nothing disappears from the site and you can edit/delete them from the admin.

---

Approve and I'll ship this in one pass: migration → server functions → admin tabs → public route rewiring → cleanup.
