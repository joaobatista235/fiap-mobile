import * as SecureStore from "expo-secure-store";

const KEYS = {
  TOKEN: "auth:token",
  USER: "auth:user",
} as const;

// Token em memória para acesso síncrono nos interceptors do axios.
let _token: string | null = null;

// Callback registrado pelo AuthContext para logout automático no 401.
let _onForceLogout: (() => void) | null = null;

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
    await Promise.all([
      SecureStore.setItemAsync(KEYS.TOKEN, token),
      SecureStore.setItemAsync(KEYS.USER, user),
    ]);
  },

  async restoreSession(): Promise<{ token: string | null; userJson: string | null }> {
    const [token, userJson] = await Promise.all([
      SecureStore.getItemAsync(KEYS.TOKEN),
      SecureStore.getItemAsync(KEYS.USER),
    ]);
    if (token) _token = token;
    return { token, userJson };
  },

  async clearSession(): Promise<void> {
    _token = null;
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.TOKEN),
      SecureStore.deleteItemAsync(KEYS.USER),
    ]);
  },
};
