// UI-facing shape, derived from the products DB row.
import type { ProductRow } from "@/lib/cms.functions";

export type ProductCategory = "Valves" | "Industrial Insulation";

export type ProductSpec = { label: string; value: string };
export type ProductFAQ = { q: string; a: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  image: string;
  gallery: string[];
  blurb: string;
  description: string;
  sku: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  specs: ProductSpec[];
  features: string[];
  applications: string[];
  faqs: ProductFAQ[];
  datasheetUrl: string | null;
  relatedIds: string[];
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1581090700227-1e8e6c2c2c1f?w=900&q=70";

export function toProduct(row: ProductRow): Product {
  const cat: ProductCategory =
    row.category === "Industrial Insulation" ? "Industrial Insulation" : "Valves";
  const specs = Array.isArray(row.specifications)
    ? (row.specifications as unknown as ProductSpec[])
    : [];
  const faqs = Array.isArray(row.faqs) ? (row.faqs as unknown as ProductFAQ[]) : [];
  const skuPrefix = cat === "Valves" ? "VL" : "IN";
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: cat,
    image: row.featured_image || PLACEHOLDER_IMG,
    gallery: row.gallery_images?.length ? row.gallery_images : [],
    blurb: row.short_description ?? "",
    description: row.full_description ?? row.short_description ?? "",
    sku: `AK-${skuPrefix}-${row.id.slice(0, 6).toUpperCase()}`,
    rating: 4.8,
    reviews: 0,
    inStock: true,
    specs,
    features: row.features ?? [],
    applications: row.applications ?? [],
    faqs,
    datasheetUrl: row.datasheet_url,
    relatedIds: row.related_product_ids ?? [],
    tags: [cat.toLowerCase()],
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
  };
}

export const CATEGORIES: { name: ProductCategory | "All"; description: string }[] = [
  { name: "All", description: "Browse the full AASHKOOR catalogue." },
  { name: "Valves", description: "Industrial gate, ball, butterfly, globe and check valves." },
  { name: "Industrial Insulation", description: "Thermal, acoustic and refractory insulation systems." },
];
