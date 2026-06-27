import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/site/CategoryPage";

export const Route = createFileRoute("/valves")({
  head: () => ({
    meta: [
      { title: "General Valves — AASHKOOR" },
      { name: "description", content: "Industrial gate, ball, butterfly, globe and check valves engineered for demanding service from certified manufacturers." },
      { property: "og:title", content: "General Valves — AASHKOOR" },
      { property: "og:description", content: "Premium industrial valves from certified manufacturers." },
      { property: "og:url", content: "/valves" },
    ],
    links: [{ rel: "canonical", href: "/valves" }],
  }),
  component: ValvesPage,
});

function ValvesPage() {
  return (
    <CategoryPage
      eyebrow="General Valves"
      title="General Valves"
      description="Industrial gate, ball, butterfly, globe and check valves engineered for pipeline isolation, throttling and non-return service. Every product is sourced from certified manufacturers with full traceability."
      category="Valves"
      related={[{ label: "Industrial Insulation", href: "/industrial-insulation" }]}
    />
  );
}
