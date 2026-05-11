import { create } from "zustand";
import { User } from "../../domain/models/User";
import { tokenMemory } from "../../infrastructure/services/tokenMemory";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with true while checking session
  setAuth: (user: User, accessToken: string) => {
    tokenMemory.set(accessToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  logout: () => {
    tokenMemory.clear();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
