import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/industrial-insulation")({
  head: () => ({
    meta: [
      { title: "Industrial Insulation — AASHKOOR" },
      { name: "description", content: "Thermal, acoustic and fire-rated insulation systems for pipes, ducts, equipment and building envelopes." },
      { property: "og:title", content: "Industrial Insulation — AASHKOOR" },
      { property: "og:description", content: "Engineered insulation systems for industrial, HVAC and building applications." },
      { property: "og:url", content: "/industrial-insulation" },
    ],
    links: [{ rel: "canonical", href: "/industrial-insulation" }],
  }),
  component: InsulationPage,
});

function InsulationPage() {
  return (
    <CategoryPage
      eyebrow="Industrial Insulation"
      title="Industrial Insulation"
      description="Thermal, acoustic and fire-rated insulation systems engineered for pipes, ducts, equipment and building envelopes — including the AASHKOOR Rock and Mineral Wool ranges."
      category="Industrial Insulation"
      related={[{ label: "General Valves", href: "/valves" }]}
    />
  );
}
