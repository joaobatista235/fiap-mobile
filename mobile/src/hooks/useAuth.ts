import { useCallback, useContext, useMemo } from "react";

import { loginRequest } from "@/src/api/auth";
import { AuthContext } from "@/src/contexts/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);

  const login = useCallback(
    async (email: string, password: string) => {
      const { token, user } = await loginRequest({ email, password });
      await ctx.signIn(token, user);
    },
    [ctx.signIn]
  );

  return useMemo(() => ({ ...ctx, login }), [ctx, login]);
}
