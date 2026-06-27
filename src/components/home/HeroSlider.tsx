import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroHvac from "@/assets/hero/hero-hvac.jpg";
import heroAgri from "@/assets/hero/hero-agriculture.jpg";
import heroPlant from "@/assets/hero/hero-industrial-plant.jpg";

type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
};

const SLIDES: Slide[] = [
  {
    image: heroHvac,
    eyebrow: "HVAC · Engineering",
    title: "Engineering the climate of",
    highlight: "modern industry.",
    description:
      "Premium chillers, AHUs and copper-pipe systems engineered for commercial and industrial scale — installed by certified teams.",
    primary: { label: "Request a quote", to: "/quote" },
    secondary: { label: "Explore valves", to: "/valves" },
  },
  {
    image: heroPlant,
    eyebrow: "Industrial Supply · Valves",
    title: "Certified components.",
    highlight: "Built to specification.",
    description:
      "Industrial valves, fittings and insulation from verified manufacturers — sourced, inspected and delivered worldwide.",
    primary: { label: "Browse catalogue", to: "/products" },
    secondary: { label: "View divisions", to: "/services" },
  },
  {
    image: heroAgri,
    eyebrow: "Agriculture · Precision",
    title: "Feeding nations with",
    highlight: "smarter systems.",
    description:
      "Precision irrigation, smart farming and end-to-end agricultural consulting for high-yield, sustainable operations.",
    primary: { label: "Talk to our team", to: "/contact" },
    secondary: { label: "Explore insulation", to: "/industrial-insulation" },
  },
];

const AUTOPLAY_MS = 6500;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length),
    [],
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, next]);

  // Touch swipe
  const [touchX, setTouchX] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    setTouchX(null);
  };

  const slide = SLIDES[index];

  return (
    <section
      className="relative isolate overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="relative min-h-[88vh] md:min-h-[94vh]">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 -z-10"
          >
            <img
              src={slide.image}
              alt={slide.title}
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-background" />
          </motion.div>
        </AnimatePresence>

        <div className="container-prose relative flex min-h-[88vh] flex-col justify-end pb-24 pt-32 md:min-h-[94vh] md:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow text-white/75">{slide.eyebrow}</p>
              <h1 className="display-hero mt-6 max-w-5xl text-white">
                {slide.title} <span className="text-primary">{slide.highlight}</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/85">
                {slide.description}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to={slide.primary.to} className="btn-primary btn-primary-hover">
                  {slide.primary.label} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={slide.secondary.to}
                  className="btn-ghost border-white/30 text-white hover:bg-white/10"
                >
                  {slide.secondary.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-14 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="group relative h-1.5 w-12 overflow-hidden rounded-full bg-white/20"
                >
                  <motion.span
                    initial={false}
                    animate={{ width: i === index ? "100%" : "0%" }}
                    transition={{
                      duration: i === index && !paused ? AUTOPLAY_MS / 1000 : 0.3,
                      ease: "linear",
                    }}
                    className="absolute inset-y-0 left-0 bg-primary"
                  />
                </button>
              ))}
              <span className="ml-4 font-display text-sm tabular-nums text-white/70">
                {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
