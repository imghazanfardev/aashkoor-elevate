import { Link } from "@tanstack/react-router";
import { Eye, FileText } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SectionHeader } from "@/components/site/Section";
import { usePublishedProducts } from "@/lib/hooks/useCms";

export function ValvesCarousel() {
  const { products } = usePublishedProducts();
  const valves = products.filter((p) => p.category === "Valves");


  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-prose py-24 md:py-32">
        <SectionHeader
          eyebrow="Vantec Valve Collection"
          title={
            <>
              Certified valves, <span className="text-primary">ready to specify.</span>
            </>
          }
          description="Explore our curated selection of Vantec industrial valves — engineered for reliable performance across commercial and industrial applications."
        />

        <div className="mt-14 valves-swiper-wrapper">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={20}
            loop
            autoplay={{ delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="!px-14 !pb-14"
          >
            {valves.map((p) => (
              <SwiperSlide key={p.slug} className="!h-auto !flex">
                <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-foreground/8 bg-card shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elev)]">
                  <div className="relative aspect-square shrink-0 overflow-hidden bg-white">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-background/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground shadow-[var(--shadow-soft)] backdrop-blur">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <Link
                      to="/products/$slug"
                      params={{ slug: p.slug }}
                      className="font-display text-base font-semibold leading-snug tracking-tight hover:text-primary line-clamp-2 min-h-[2.75rem]"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{p.blurb}</p>
                    <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                      <Link
                        to="/products/$slug"
                        params={{ slug: p.slug }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-foreground/15 px-3 py-2.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </Link>
                      <Link
                        to="/quote"
                        search={{ product: p.slug }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                      >
                        <FileText className="h-3.5 w-3.5" /> Quote
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .valves-swiper-wrapper .swiper-wrapper {
          align-items: stretch;
        }
        .valves-swiper-wrapper .swiper-button-next,
        .valves-swiper-wrapper .swiper-button-prev {
          color: var(--primary);
          background: var(--background);
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          box-shadow: 0 4px 12px -4px color-mix(in oklab, var(--foreground) 25%, transparent);
          border: 1px solid color-mix(in oklab, var(--foreground) 10%, transparent);
          top: 50%;
          transform: translateY(-50%);
          margin-top: 0;
        }
        .valves-swiper-wrapper .swiper-button-next { right: 0; }
        .valves-swiper-wrapper .swiper-button-prev { left: 0; }
        .valves-swiper-wrapper .swiper-button-next::after,
        .valves-swiper-wrapper .swiper-button-prev::after {
          font-size: 11px;
          font-weight: 800;
        }
        .valves-swiper-wrapper .swiper-button-disabled {
          opacity: 0.35;
        }
        .valves-swiper-wrapper .swiper-pagination-bullet {
          background: var(--foreground);
          opacity: 0.25;
        }
        .valves-swiper-wrapper .swiper-pagination-bullet-active {
          background: var(--primary);
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
