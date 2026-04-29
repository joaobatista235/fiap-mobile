import * as SecureStore from "expo-secure-store";

const KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
} as const;

let _token: string | null = null;

let _onForceLogout: (() => void) | null = null;

export const tokenStorage = {
  getToken: () => _token,

  registerLogoutCallback: (cb: () => void) => {
    _onForceLogout = cb;
  },
  triggerLogout: () => {
    _onForceLogout?.();
  },

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
