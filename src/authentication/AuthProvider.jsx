import { useEffect, useMemo, useState } from "react";
import {
  ApiError,
  getCurrentAccount,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "../api/auth";
import AuthContext from "./auth-context";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getCurrentAccount({ signal: controller.signal })
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch((error) => {
        if (
          error?.name !== "AbortError" &&
          !(error instanceof ApiError && error.status === 401)
        ) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      user,
      async login(credentials) {
        const response = await loginAccount(credentials);
        setUser(response.user);
        return response.user;
      },
      async logout() {
        try {
          await logoutAccount();
        } finally {
          setUser(null);
        }
      },
      async register(account) {
        const response = await registerAccount(account);
        setUser(response.user);
        return response.user;
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
