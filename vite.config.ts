import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// On Vercel (VERCEL=1) emit the Build Output API v3 bundle at `.vercel/output/`.
// Everywhere else keep the default `dist/` layout that the Lovable platform
// build-check expects.
const isVercel = !!process.env.VERCEL;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: isVercel
    ? {
        preset: "vercel",
        output: {
          dir: ".vercel/output",
          publicDir: ".vercel/output/static",
          serverDir: ".vercel/output/functions/__server.func",
        },
      }
    : undefined,
});
