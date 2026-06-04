import hvac from "@/assets/projects/project-hvac.jpg";
import agri from "@/assets/projects/project-agri.jpg";
import industrial from "@/assets/projects/project-industrial.jpg";
import warehouse from "@/assets/projects/project-warehouse.jpg";

export type Project = {
  slug: string;
  title: string;
  division: string;
  location: string;
  year: string;
  image: string;
  blurb: string;
  stats: { value: string; label: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "skyline-tower-hvac",
    title: "Skyline Tower · Central HVAC",
    division: "HVAC",
    location: "Riyadh, KSA",
    year: "2025",
    image: hvac,
    blurb:
      "Design-build of a 12 MW central plant serving a 240,000 m² mixed-use tower — delivered nine weeks ahead of schedule.",
    stats: [
      { value: "12 MW", label: "Cooling capacity" },
      { value: "240k m²", label: "Conditioned area" },
      { value: "-9w", label: "Ahead of schedule" },
    ],
  },
  {
    slug: "delta-precision-agriculture",
    title: "Delta · Precision Agriculture",
    division: "Agriculture",
    location: "Nile Delta, EG",
    year: "2024",
    image: agri,
    blurb:
      "Smart-irrigation rollout across 1,800 hectares of greenhouse farms, lifting yield by 31% in the first season.",
    stats: [
      { value: "1,800 ha", label: "Coverage" },
      { value: "+31%", label: "Yield lift" },
      { value: "42%", label: "Water saved" },
    ],
  },
  {
    slug: "atlas-refinery-valve-supply",
    title: "Atlas Refinery · Valve Supply",
    division: "Valves",
    location: "Jubail, KSA",
    year: "2024",
    image: industrial,
    blurb:
      "End-to-end valve supply and qualification for a Tier 1 refinery turnaround — 3,400 line items delivered on schedule.",
    stats: [
      { value: "3,400", label: "Line items" },
      { value: "100%", label: "On-time delivery" },
      { value: "0", label: "Field rejections" },
    ],
  },
  {
    slug: "northport-logistics-insulation",
    title: "Northport Logistics · Cold-Store Insulation",
    division: "Insulation",
    location: "Jebel Ali, UAE",
    year: "2023",
    image: warehouse,
    blurb:
      "Complete envelope insulation for a 95,000 m² automated cold-store facility — delivering 28% lower running costs.",
    stats: [
      { value: "95k m²", label: "Envelope insulated" },
      { value: "-28%", label: "Energy cost" },
      { value: "U=0.18", label: "Wall performance" },
    ],
  },
];
