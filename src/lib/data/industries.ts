import {
  Factory,
  Building2,
  Sprout,
  Warehouse,
  Cog,
  HardHat,
  type LucideIcon,
} from "lucide-react";

export type Industry = {
  name: string;
  icon: LucideIcon;
  blurb: string;
  image: string;
};

import hvac from "@/assets/projects/project-hvac.jpg";
import agri from "@/assets/projects/project-agri.jpg";
import industrial from "@/assets/projects/project-industrial.jpg";
import warehouse from "@/assets/projects/project-warehouse.jpg";

export const INDUSTRIES: Industry[] = [
  { name: "Manufacturing", icon: Factory, blurb: "Plant engineering and supply for high-throughput manufacturing.", image: industrial },
  { name: "Commercial Buildings", icon: Building2, blurb: "HVAC and envelope systems for landmark commercial real estate.", image: hvac },
  { name: "Agriculture", icon: Sprout, blurb: "Precision farms, smart greenhouses and irrigation networks.", image: agri },
  { name: "Warehouses", icon: Warehouse, blurb: "Cold-store insulation and climate control at scale.", image: warehouse },
  { name: "Industrial Plants", icon: Cog, blurb: "Process valves, instrumentation and refractory packages.", image: industrial },
  { name: "Construction", icon: HardHat, blurb: "Mega-project supply with engineered logistics support.", image: warehouse },
];
