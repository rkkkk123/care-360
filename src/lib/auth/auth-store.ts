import { create } from "zustand";
import { UserProfile } from "@/types/user";
import { auth } from "./auth-service";

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user }),
  initialize: async () => {
    try {
      const { user, error } = await auth.getSession();
      set({ user, error, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error("Failed to initialize auth"), isLoading: false });
    }
  },
  signOut: async () => {
    set({ isLoading: true });
    await auth.signOut();
    set({ user: null, isLoading: false });
  }
}));
