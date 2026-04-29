import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
} as const;

// Token em memória para acesso síncrono nos interceptors do axios.
let _token: string | null = null;

// Callback registrado pelo AuthContext para logout automático no 401.
let _onForceLogout: (() => void) | null = null;

// Web usa localStorage; mobile usa SecureStore.
const store = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined"
        ? localStorage.getItem(key)
        : null;
    }
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const tokenStorage = {
  // --- Síncrono (interceptor) ---
  getToken: () => _token,

  // --- Registro do callback de logout forçado ---
  registerLogoutCallback: (cb: () => void) => {
    _onForceLogout = cb;
  },
  triggerLogout: () => {
    _onForceLogout?.();
  },

  // --- Persistência assíncrona ---
  async saveSession(token: string, user: string): Promise<void> {
    _token = token;
    await Promise.all([store.set(KEYS.TOKEN, token), store.set(KEYS.USER, user)]);
  },

  async restoreSession(): Promise<{ token: string | null; userJson: string | null }> {
    const [token, userJson] = await Promise.all([
      store.get(KEYS.TOKEN),
      store.get(KEYS.USER),
    ]);
    if (token) _token = token;
    return { token, userJson };
  },

  async clearSession(): Promise<void> {
    _token = null;
    await Promise.all([store.remove(KEYS.TOKEN), store.remove(KEYS.USER)]);
  },
};
