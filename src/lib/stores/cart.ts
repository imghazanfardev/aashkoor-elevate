import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  category: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (isOpen) => set({ isOpen }),
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              isOpen: true,
              items: s.items.map((i) =>
                i.slug === item.slug ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { isOpen: true, items: [...s.items, { ...item, qty }] };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    {
      name: "aashkoor-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never),
      ),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);
