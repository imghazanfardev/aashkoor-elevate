import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, LayoutDashboard, LogIn, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/lib/stores/cart";
import { useWishlist } from "@/lib/stores/wishlist";
import { useDemoAuth } from "@/lib/stores/auth";
import { SearchDialog } from "./SearchDialog";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/products/categories", label: "Categories" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const setCartOpen = useCart((s) => s.setOpen);
  const wishCount = useWishlist((s) => s.slugs.length);
  const user = useDemoAuth((s) => s.user);
  const logout = useDemoAuth((s) => s.logout);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav" : "bg-transparent"
        }`}
      >
        <div className="container-prose flex h-16 items-center justify-between gap-4 md:h-20">
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
            {NAV.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <IconButton
              label="Search"
              onClick={() => setSearchOpen(true)}
              icon={<Search className="h-4.5 w-4.5" />}
            />
            <IconButton
              label="Wishlist"
              as={Link}
              to="/wishlist"
              badge={wishCount}
              icon={<Heart className="h-4.5 w-4.5" />}
            />
            <IconButton
              label="Quote cart"
              onClick={() => setCartOpen(true)}
              badge={cartCount}
              icon={<ShoppingBag className="h-4.5 w-4.5" />}
            />

            <div className="relative">
              <IconButton
                label="Account"
                onClick={() => setAccountOpen((s) => !s)}
                icon={<User className="h-4.5 w-4.5" />}
              />
              {accountOpen && (
                <div
                  className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-foreground/10 bg-background p-2 shadow-xl"
                  onMouseLeave={() => setAccountOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="border-b border-foreground/10 px-3 py-3">
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="truncate text-sm font-semibold">{user.email}</p>
                      </div>
                      <MenuLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                        Customer dashboard
                      </MenuLink>
                      {user.role === "admin" && (
                        <MenuLink to="/admin" icon={<LayoutDashboard className="h-4 w-4" />}>
                          Admin dashboard
                        </MenuLink>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setAccountOpen(false);
                        }}
                        className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-foreground/80 hover:bg-muted"
                      >
                        <LogIn className="h-4 w-4 rotate-180" /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <MenuLink to="/auth" icon={<LogIn className="h-4 w-4" />}>
                        Sign in
                      </MenuLink>
                      <MenuLink to="/auth" icon={<User className="h-4 w-4" />} search={{ tab: "register" }}>
                        Create account
                      </MenuLink>
                      <div className="my-1 border-t border-foreground/10" />
                      <MenuLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                        Dashboard preview
                      </MenuLink>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/quote" className="btn-primary btn-primary-hover ml-1 hidden md:inline-flex">
              Request Quote
            </Link>

            <button
              className="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 lg:hidden"
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

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  badge,
  as,
  to,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  badge?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any;
  to?: string;
}) {
  const Cmp: React.ElementType = as ?? "button";
  const props = as
    ? { to, "aria-label": label }
    : { onClick, "aria-label": label, type: "button" as const };
  return (
    <Cmp
      {...props}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Cmp>
  );
}

function MenuLink({
  to,
  icon,
  children,
  search,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  search?: Record<string, string>;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search={search as any}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
    >
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </Link>
  );
}
