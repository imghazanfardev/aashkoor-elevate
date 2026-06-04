import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/services/hvac", label: "HVAC" },
  { to: "/services/agriculture", label: "Agriculture" },
  { to: "/services/industrial-supply", label: "Industrial" },
  { to: "/products", label: "Products" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav" : "bg-transparent"
      }`}
    >
      <div className="container-prose flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-3" aria-label="AASHKOOR home">
          <img
            src="https://ik.imagekit.io/tn3yztqzbb/Asset%201.png"
            alt="AASHKOOR"
            className="h-8 w-auto md:h-9"
            width={140}
            height={36}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.slice(1, 8).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/quote" className="btn-primary btn-primary-hover hidden md:inline-flex">
            Request Quote
          </Link>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-foreground/10 bg-background lg:hidden">
          <nav className="container-prose flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-foreground/80 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/quote"
              onClick={() => setOpen(false)}
              className="btn-primary btn-primary-hover mt-3 self-start"
            >
              Request Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
