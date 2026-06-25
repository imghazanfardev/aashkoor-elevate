export type ProductCategory = "Valves" | "Insulation Products";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  image: string;
  blurb: string;
  description: string;
  sku: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  specs: { label: string; value: string }[];
  downloads: { label: string; href: string }[];
  tags: string[];
};

const VALVE_BASE =
  "https://ik.imagekit.io/tn3yztqzbb/AASHKOOR%20VALVES%20FOLDER";
const INSULATION_BASE =
  "https://ik.imagekit.io/tn3yztqzbb/AASHKOOR%20INSULATION%20FOLDER";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

type Seed = {
  name: string;
  category: ProductCategory;
  imageFile: string;
  blurb: string;
  description: string;
  specs: { label: string; value: string }[];
  tags: string[];
};

const VALVE_SEEDS: Seed[] = [
  {
    name: "Stainless Steel Ball Valve – DN50",
    category: "Valves",
    imageFile: "Stainless-Steel-Ball-Valve-_-DN50.png",
    blurb: "Three-piece SS316 ball valve, mirror polished.",
    description:
      "Three-piece SS316 ball valve enabling in-line service. Mirror-polished body with PTFE seats — ideal for hygienic, chemical and process applications.",
    specs: [
      { label: "Body", value: "SS316" },
      { label: "Pressure", value: "PN40" },
      { label: "Seat", value: "PTFE" },
      { label: "Connection", value: "Threaded BSP" },
      { label: "Operation", value: "Lever / Actuator-ready" },
    ],
    tags: ["hygienic", "chemical", "stainless"],
  },
  {
    name: "Wafer Butterfly Valve – DN200",
    category: "Valves",
    imageFile: "Wafer-Butterfly-Valve-_-DN200.png",
    blurb: "EPDM-lined wafer butterfly with ductile body.",
    description:
      "Lightweight wafer-type butterfly valve with EPDM liner. Excellent throttling and bubble-tight shut-off in water and HVAC applications.",
    specs: [
      { label: "Body", value: "Ductile iron GGG40" },
      { label: "Liner", value: "EPDM" },
      { label: "Pressure", value: "PN16" },
      { label: "Disc", value: "SS316" },
      { label: "Operation", value: "Handwheel / Gear" },
    ],
    tags: ["water", "HVAC", "throttling"],
  },
  {
    name: "Globe Valve – DN80",
    category: "Valves",
    imageFile: "Globe-Valve-_-DN80.png",
    blurb: "Precision flow regulation in steam service.",
    description:
      "Cast steel globe valve engineered for precise flow control under high temperature and pressure — a workhorse for steam and process plants.",
    specs: [
      { label: "Body", value: "ASTM A216 WCB" },
      { label: "Pressure", value: "CL300" },
      { label: "Service", value: "Steam · Hot water · Oil" },
      { label: "Connection", value: "Flanged RF" },
    ],
    tags: ["steam", "process", "regulation"],
  },
  {
    name: "Industrial Gate Valve – DN100",
    category: "Valves",
    imageFile: "Industrial-Gate-Valve-_-DN100.png",
    blurb: "API 600 cast steel gate valve with rising stem.",
    description:
      "Engineered for full-bore isolation in high-pressure pipeline service. Forged steel body, bolted bonnet, and back-seat design for in-line maintenance.",
    specs: [
      { label: "Standard", value: "API 600" },
      { label: "Body", value: "Cast steel ASTM A216 WCB" },
      { label: "Pressure", value: "PN40 · CL300" },
      { label: "Connection", value: "Flanged RF" },
      { label: "Temperature", value: "−29°C to 425°C" },
    ],
    tags: ["pipeline", "isolation", "carbon-steel"],
  },
  {
    name: "Swing Check Valve – DN150",
    category: "Valves",
    imageFile: "Swing-Check-Valve-_-DN150.png",
    blurb: "Low-pressure-drop reverse-flow prevention.",
    description:
      "Cast iron swing check valve with bolted cover. Prevents reverse flow in pump discharge and pipeline systems while keeping pressure drop low.",
    specs: [
      { label: "Body", value: "Cast iron GG25" },
      { label: "Pressure", value: "PN16" },
      { label: "Connection", value: "Flanged RF" },
    ],
    tags: ["pump", "non-return", "pipeline"],
  },
];

const INSULATION_NAMES = [
  "Rock Proof H",
  "Rock One",
  "Rock Plus",
  "Supreme Flex Pipes",
  "Rock Seal 777",
  "Supreme Flex Rolls",
  "Rock Plast",
  "Rock Seal 777 Mix",
  "Rock Torch",
  "Mineral Wool Blankets (Rolls)",
  "Mineral Wool Pipe Sections",
  "Rock Seal 777 Elastic",
  "Mineral Wool Boards (Slabs)",
  "Rock Shield",
  "Rock Proof",
  "Rock Star",
  "Rock Flex",
  "Rock Pro",
];

const INSULATION_FILE: Record<string, string> = {
  // Filename pattern mirrors the valves folder: Title-With-Dashes.png
};

const INSULATION_SEEDS: Seed[] = INSULATION_NAMES.map((name) => {
  const file =
    INSULATION_FILE[name] ??
    `${name.replace(/[()]/g, "").trim().replace(/\s+/g, "-")}.png`;
  return {
    name,
    category: "Insulation Products" as const,
    imageFile: file,
    blurb: `${name} — high-performance industrial insulation system.`,
    description: `${name} is part of the AASHKOOR insulation range — engineered for thermal, acoustic and fire performance across industrial, commercial and HVAC applications. Suitable for pipes, ducts, equipment and building envelopes.`,
    specs: [
      { label: "Category", value: "Insulation Products" },
      { label: "Application", value: "Industrial · HVAC · Building" },
      { label: "Service", value: "Thermal · Acoustic · Fire" },
    ],
    tags: ["insulation", "thermal", "acoustic"],
  };
});

function build(seed: Seed, idx: number): Product {
  const slug = slugify(seed.name);
  const base = seed.category === "Valves" ? VALVE_BASE : INSULATION_BASE;
  return {
    slug,
    name: seed.name,
    category: seed.category,
    image: `${base}/${seed.imageFile}`,
    blurb: seed.blurb,
    description: seed.description,
    sku: `AK-${seed.category === "Valves" ? "VL" : "IN"}-${String(idx + 1).padStart(3, "0")}`,
    rating: 4.8,
    reviews: 0,
    inStock: true,
    specs: seed.specs,
    downloads: [{ label: "Request datasheet (PDF)", href: "#" }],
    tags: seed.tags,
  };
}

export const PRODUCTS: Product[] = [
  ...VALVE_SEEDS.map((s, i) => build(s, i)),
  ...INSULATION_SEEDS.map((s, i) => build(s, i)),
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(slug: string, n = 3) {
  const p = getProduct(slug);
  if (!p) return [];
  return PRODUCTS.filter((x) => x.slug !== slug && x.category === p.category).slice(0, n);
}

export const CATEGORIES: { name: ProductCategory | "All"; description: string }[] = [
  { name: "All", description: "Browse the full AASHKOOR catalogue." },
  { name: "Valves", description: "Industrial gate, ball, butterfly, globe and check valves." },
  { name: "Insulation Products", description: "Thermal, acoustic and refractory insulation systems." },
];
