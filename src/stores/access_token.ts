import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    tokenField: 'kiraAccessToken',
    accessToken: null
  }),
  actions: {
    setToken(token: string) {
      this.accessToken = token;
      localStorage.setItem(this.tokenField, token)
    },
    loadToken() {
      this.accessToken = localStorage.getItem(this.tokenField);
    },
    clearToken() {
      this.accessToken = null;
      localStorage.removeItem(this.tokenField);
    }
  }
});

interface AuthState {
  tokenField: string;
  accessToken: string | null;
}