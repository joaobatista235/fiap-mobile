import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { tokenStorage } from "@/src/storage/token";
import type { User } from "@/src/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(initialState);

  // Restaura sessão persistida ao iniciar o app.
  useEffect(() => {
    tokenStorage
      .restoreSession()
      .then(({ token, userJson }) => {
        if (token && userJson) {
          const user = JSON.parse(userJson) as User;
          setState({ user, token, isAuthenticated: true, isLoading: false });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      })
      .catch(() => {
        setState((prev) => ({ ...prev, isLoading: false }));
      });
  }, []);

  const signIn = useCallback(async (token: string, user: User) => {
    await tokenStorage.saveSession(token, JSON.stringify(user));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }, []);

  const signOut = useCallback(async () => {
    await tokenStorage.clearSession();
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  // Registra signOut como callback para o axios disparar no 401.
  useEffect(() => {
    tokenStorage.registerLogoutCallback(signOut);
  }, [signOut]);

  const value = useMemo(
    () => ({ ...state, signIn, signOut }),
    [state, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
