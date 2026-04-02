import { defineStore } from "pinia";
import { apiLogin, apiMe, apiRegister, type AuthUser } from "@/api/auth";

const TOKEN_KEY = "auth_token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    error: "" as string,
    loading: false,
    token: null as string | null,
    user: null as AuthUser | null,
  }),
  actions: {
    async register(username: string, password: string): Promise<boolean> {
      this.loading = true;
      this.error = "";
      try {
        const result = await apiRegister(username, password);
        if (!result.ok) {
          this.error = result.error;
          return false;
        }
        this.token = result.data.token;
        localStorage.setItem(TOKEN_KEY, result.data.token);
        const me = await apiMe(result.data.token);
        this.user = me.ok ? me.data : null;
        return true;
      } catch {
        this.error = "Unexpected error";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async login(username: string, password: string): Promise<boolean> {
      this.loading = true;
      this.error = "";
      try {
        const result = await apiLogin(username, password);
        if (!result.ok) {
          this.error = result.error;
          return false;
        }
        this.token = result.data.token;
        localStorage.setItem(TOKEN_KEY, result.data.token);
        const me = await apiMe(result.data.token);
        this.user = me.ok ? me.data : null;
        return true;
      } catch {
        this.error = "Unexpected error";
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout(): void {
      this.token = null;
      this.user = null;
      this.error = "";
      localStorage.removeItem(TOKEN_KEY);
    },

    async restoreSession(): Promise<void> {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;
      const result = await apiMe(token);
      if (result.ok) {
        this.token = token;
        this.user = result.data;
      } else {
        this.token = null;
        this.user = null;
        localStorage.removeItem(TOKEN_KEY);
      }
    },
  },
});
