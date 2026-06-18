import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import LogoImage from "@/assets/aashkoorw.png";

export function Footer() {
  return (
    <footer className="mt-32 bg-[var(--color-foreground)] text-background">
      <div className="container-prose py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img
              src={LogoImage}
              alt="AASHKOOR"
              className="h-9 w-auto brightness-0 invert"
              width={200}
              height={50}
            />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-background/65">
              Engineering excellence across HVAC, agriculture, industrial valves and insulation.
              Trusted by enterprises building tomorrow.
            </p>
            <Link to="/quote" search={{ product: "" }} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Start a project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <FooterCol
            title="Divisions"
            links={[
              { to: "/services/hvac", label: "HVAC Solutions" },
              { to: "/services/agriculture", label: "Agriculture" },
              { to: "/services/industrial-supply", label: "Industrial Supply" },
              { to: "/products", label: "Product Catalogue" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/blog", label: "Insights" },
              { to: "/contact", label: "Contact" },
            ]}
          />

          <div>
            <h4 className="eyebrow text-background/60">Get in touch</h4>
            <ul className="mt-5 space-y-3 text-sm text-background/80">
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Industrial HQ, Global Operations</li>
              <li className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +000 000 0000</li>
              <li className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-primary" /> hello@aashkoor.com</li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-16 flex flex-col items-start justify-between gap-3 pt-8 text-xs text-background/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} AASHKOOR. All rights reserved.</p>
          <p>Engineered for industrial excellence.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="eyebrow text-background/60">{title}</h4>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-background/80 transition-colors hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
