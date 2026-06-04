import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Demo-only client-side "auth" for the customer dashboard preview.
// Replace with Lovable Cloud auth when real accounts go live.
export type DemoUser = { id: string; name: string; email: string; role: "customer" | "admin" };

type AuthState = {
  user: DemoUser | null;
  login: (email: string, name?: string, role?: DemoUser["role"]) => void;
  logout: () => void;
};

export const useDemoAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, name, role = "customer") =>
        set({
          user: {
            id: crypto.randomUUID(),
            email,
            name: name || email.split("@")[0],
            role,
          },
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: "aashkoor-demo-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never),
      ),
    },
  ),
);
