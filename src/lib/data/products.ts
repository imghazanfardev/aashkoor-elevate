import valveGate from "@/assets/products/valve-gate.png";
import valveBall from "@/assets/products/valve-ball.png";
import valveButterfly from "@/assets/products/valve-butterfly.png";
import valveGlobe from "@/assets/products/valve-globe.png";
import valveCheck from "@/assets/products/valve-check.png";
import insRockwool from "@/assets/products/ins-rockwool.png";
import insFiberglass from "@/assets/products/ins-fiberglass.png";
import insCeramic from "@/assets/products/ins-ceramic.png";
import insPipe from "@/assets/products/ins-pipe.png";
import insPanel from "@/assets/products/ins-panel.png";

export type ProductCategory = "Valves" | "Insulation" | "HVAC" | "Agriculture";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  image: string;
  blurb: string;
  description: string;
  price: number;
  sku: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  specs: { label: string; value: string }[];
  downloads: { label: string; href: string }[];
  tags: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "industrial-gate-valve-dn100",
    name: "Industrial Gate Valve · DN100",
    category: "Valves",
    image: valveGate,
    blurb: "API 600 cast steel gate valve with rising stem.",
    description:
      "Engineered for full-bore isolation in high-pressure pipeline service. Forged steel body, bolted bonnet, and a back-seat design for in-line maintenance.",
    price: 1280,
    sku: "AK-GV-DN100",
    rating: 4.9,
    reviews: 128,
    inStock: true,
    specs: [
      { label: "Standard", value: "API 600" },
      { label: "Body", value: "Cast steel ASTM A216 WCB" },
      { label: "Pressure", value: "PN40 · CL300" },
      { label: "Connection", value: "Flanged RF" },
      { label: "Temperature", value: "−29°C to 425°C" },
    ],
    downloads: [
      { label: "Technical datasheet (PDF)", href: "#" },
      { label: "Installation manual (PDF)", href: "#" },
    ],
    tags: ["pipeline", "isolation", "carbon-steel"],
  },
  {
    slug: "stainless-ball-valve-dn50",
    name: "Stainless Steel Ball Valve · DN50",
    category: "Valves",
    image: valveBall,
    blurb: "Three-piece SS316 ball valve, mirror polished.",
    description:
      "Three-piece design enabling in-line service. Mirror-polished 316 stainless body with PTFE seats — ideal for hygienic and chemical applications.",
    price: 312,
    sku: "AK-BV-DN50",
    rating: 4.8,
    reviews: 214,
    inStock: true,
    specs: [
      { label: "Body", value: "SS316" },
      { label: "Pressure", value: "PN40" },
      { label: "Seat", value: "PTFE" },
      { label: "Connection", value: "Threaded BSP" },
      { label: "Operation", value: "Lever / Actuator-ready" },
    ],
    downloads: [{ label: "Datasheet (PDF)", href: "#" }],
    tags: ["hygienic", "chemical", "stainless"],
  },
  {
    slug: "butterfly-valve-dn200",
    name: "Wafer Butterfly Valve · DN200",
    category: "Valves",
    image: valveButterfly,
    blurb: "EPDM lined wafer butterfly with ductile body.",
    description:
      "Lightweight wafer-type butterfly valve with EPDM liner. Excellent throttling and bubble-tight shut-off in water and HVAC applications.",
    price: 540,
    sku: "AK-BF-DN200",
    rating: 4.7,
    reviews: 96,
    inStock: true,
    specs: [
      { label: "Body", value: "Ductile iron GGG40" },
      { label: "Liner", value: "EPDM" },
      { label: "Pressure", value: "PN16" },
      { label: "Disc", value: "SS316" },
      { label: "Operation", value: "Handwheel / Gear" },
    ],
    downloads: [{ label: "Datasheet (PDF)", href: "#" }],
    tags: ["water", "HVAC", "throttling"],
  },
  {
    slug: "globe-valve-dn80",
    name: "Globe Valve · DN80",
    category: "Valves",
    image: valveGlobe,
    blurb: "Precision flow regulation in steam service.",
    description:
      "Cast steel globe valve engineered for precise flow control under high temperature and pressure — a workhorse for steam and process plants.",
    price: 720,
    sku: "AK-GL-DN80",
    rating: 4.8,
    reviews: 64,
    inStock: true,
    specs: [
      { label: "Body", value: "ASTM A216 WCB" },
      { label: "Pressure", value: "CL300" },
      { label: "Service", value: "Steam · Hot water · Oil" },
      { label: "Connection", value: "Flanged RF" },
    ],
    downloads: [{ label: "Datasheet (PDF)", href: "#" }],
    tags: ["steam", "process", "regulation"],
  },
  {
    slug: "swing-check-valve-dn150",
    name: "Swing Check Valve · DN150",
    category: "Valves",
    image: valveCheck,
    blurb: "Low-pressure-drop reverse-flow prevention.",
    description:
      "Cast iron swing check valve with bolted cover. Prevents reverse flow in pump discharge and pipeline systems while keeping pressure drop low.",
    price: 460,
    sku: "AK-CV-DN150",
    rating: 4.6,
    reviews: 51,
    inStock: true,
    specs: [
      { label: "Body", value: "Cast iron GG25" },
      { label: "Pressure", value: "PN16" },
      { label: "Connection", value: "Flanged RF" },
    ],
    downloads: [{ label: "Datasheet (PDF)", href: "#" }],
    tags: ["pump", "non-return", "pipeline"],
  },
  {
    slug: "rockwool-insulation-slab",
    name: "Rockwool Insulation Slab",
    category: "Insulation",
    image: insRockwool,
    blurb: "Dense stone wool slab — fire and acoustic rated.",
    description:
      "High-density stone wool slab providing exceptional thermal, fire and acoustic performance for industrial walls, roofs and equipment.",
    price: 38,
    sku: "AK-RW-100",
    rating: 4.9,
    reviews: 312,
    inStock: true,
    specs: [
      { label: "Density", value: "100 kg/m³" },
      { label: "Conductivity (λ)", value: "0.035 W/m·K" },
      { label: "Fire class", value: "Euroclass A1" },
      { label: "Thickness", value: "50–150 mm" },
    ],
    downloads: [{ label: "Spec sheet (PDF)", href: "#" }],
    tags: ["fire-rated", "acoustic", "industrial"],
  },
  {
    slug: "fiberglass-insulation-roll",
    name: "Fiberglass Insulation Roll",
    category: "Insulation",
    image: insFiberglass,
    blurb: "Lightweight blanket for ducts and large surfaces.",
    description:
      "Resilient fiberglass blanket designed for thermal insulation of HVAC ducts, large vessels and cavity walls. Easy to install, lightweight.",
    price: 52,
    sku: "AK-FG-50",
    rating: 4.7,
    reviews: 187,
    inStock: true,
    specs: [
      { label: "Density", value: "48 kg/m³" },
      { label: "Conductivity (λ)", value: "0.038 W/m·K" },
      { label: "Roll size", value: "15 × 1.2 m" },
    ],
    downloads: [{ label: "Spec sheet (PDF)", href: "#" }],
    tags: ["HVAC", "ductwork", "lightweight"],
  },
  {
    slug: "ceramic-fiber-blanket",
    name: "Ceramic Fiber Blanket",
    category: "Insulation",
    image: insCeramic,
    blurb: "High-temperature blanket for furnaces & kilns.",
    description:
      "Refractory ceramic fiber blanket suitable for service up to 1260°C — ideal for furnace linings, kilns and high-temperature process equipment.",
    price: 84,
    sku: "AK-CF-1260",
    rating: 4.9,
    reviews: 73,
    inStock: true,
    specs: [
      { label: "Max temperature", value: "1260°C" },
      { label: "Density", value: "128 kg/m³" },
      { label: "Thickness", value: "25 mm" },
    ],
    downloads: [{ label: "Spec sheet (PDF)", href: "#" }],
    tags: ["high-temperature", "furnace", "refractory"],
  },
  {
    slug: "pre-insulated-pipe-system",
    name: "Pre-Insulated Pipe System",
    category: "Insulation",
    image: insPipe,
    blurb: "Aluminium-jacketed sections for chilled water.",
    description:
      "Factory pre-formed pipe insulation with aluminium jacket — engineered for chilled water and refrigeration lines with vapor-tight performance.",
    price: 96,
    sku: "AK-PI-50",
    rating: 4.8,
    reviews: 41,
    inStock: true,
    specs: [
      { label: "Service", value: "Chilled water / Refrigeration" },
      { label: "Jacket", value: "Aluminium 0.2 mm" },
      { label: "Core", value: "Closed-cell elastomeric" },
    ],
    downloads: [{ label: "Spec sheet (PDF)", href: "#" }],
    tags: ["chilled-water", "refrigeration", "jacketed"],
  },
  {
    slug: "thermal-insulation-panel",
    name: "Thermal Insulation Panel",
    category: "Insulation",
    image: insPanel,
    blurb: "Rigid PIR board with foil facing.",
    description:
      "Rigid polyisocyanurate (PIR) panel with reflective foil facing. The thinnest practical solution for high-performance thermal envelopes.",
    price: 64,
    sku: "AK-PIR-80",
    rating: 4.8,
    reviews: 158,
    inStock: false,
    specs: [
      { label: "Density", value: "32 kg/m³" },
      { label: "Conductivity (λ)", value: "0.022 W/m·K" },
      { label: "Panel size", value: "1200 × 600 mm" },
    ],
    downloads: [{ label: "Spec sheet (PDF)", href: "#" }],
    tags: ["envelope", "PIR", "energy-efficient"],
  },
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
  { name: "Insulation", description: "Thermal, acoustic and refractory insulation systems." },
  { name: "HVAC", description: "HVAC components and modular plant." },
  { name: "Agriculture", description: "Smart agriculture products and irrigation systems." },
];
