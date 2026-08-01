import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "seller";
  token: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userInfo") || "null")
      : null,
  setUser: (user) => {
    if (user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
    } else {
      localStorage.removeItem("userInfo");
    }
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("userInfo");
    set({ user: null });
  },
}));
