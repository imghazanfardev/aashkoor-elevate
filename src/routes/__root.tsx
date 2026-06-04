import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-section mt-4">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary btn-primary-hover mt-8 inline-flex">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="display-section">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We've logged the error. Please try again or head home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary btn-primary-hover"
          >
            Try again
          </button>
          <a href="/" className="btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AASHKOOR — Engineering Excellence" },
      {
        name: "description",
        content:
          "AASHKOOR delivers premium HVAC, agriculture, industrial valves and insulation solutions for enterprises worldwide.",
      },
      { property: "og:site_name", content: "AASHKOOR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#459E5A" },
      { property: "og:title", content: "AASHKOOR — Engineering Excellence" },
      { name: "twitter:title", content: "AASHKOOR — Engineering Excellence" },
      { name: "description", content: "AASHKOOR Enterprise Hub is a premium corporate website and admin dashboard for AASHKOOR's diverse business divisions." },
      { property: "og:description", content: "AASHKOOR Enterprise Hub is a premium corporate website and admin dashboard for AASHKOOR's diverse business divisions." },
      { name: "twitter:description", content: "AASHKOOR Enterprise Hub is a premium corporate website and admin dashboard for AASHKOOR's diverse business divisions." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/40905140-59f6-453f-a9d4-95f5dfe40324/id-preview-e6bc38e0--9c103887-1c04-4967-9a5f-29f2610c51f4.lovable.app-1780568068006.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/40905140-59f6-453f-a9d4-95f5dfe40324/id-preview-e6bc38e0--9c103887-1c04-4967-9a5f-29f2610c51f4.lovable.app-1780568068006.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
      },
      { rel: "icon", href: "https://ik.imagekit.io/tn3yztqzbb/Asset%201.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AASHKOOR",
          url: "/",
          logo: "https://ik.imagekit.io/tn3yztqzbb/Asset%201.png",
          description:
            "Enterprise HVAC, agriculture, industrial valves and insulation solutions.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Shell />
    </QueryClientProvider>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Scroll to top on navigation (router has scrollRestoration too)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </>
  );
}
