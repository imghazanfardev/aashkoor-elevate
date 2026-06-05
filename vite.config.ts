import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Force-on nitro with the Vercel preset so `vite build` emits
  // a Vercel Build Output API v3 bundle at `.vercel/output/`
  // (auto-detected by Vercel — no outputDirectory needed).
  nitro: {
    preset: "vercel",
  },
});
