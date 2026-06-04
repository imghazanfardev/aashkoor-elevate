import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistState = {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) =>
        set((s) => ({
          slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug],
        })),
      has: (slug) => get().slugs.includes(slug),
      clear: () => set({ slugs: [] }),
    }),
    {
      name: "aashkoor-wishlist",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never),
      ),
    },
  ),
);
