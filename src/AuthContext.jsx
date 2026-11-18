import { createContext, useContext, useEffect, useState } from "react";
import { authApi, clearTokens, getAccessToken, subscribeTokensCleared } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeTokensCleared(() => setUser(null));
    if (getAccessToken()) {
      authApi
        .me()
        .then(setUser)
        .catch(() => clearTokens())
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
    return unsubscribe;
  }, []);

  async function login(username, password) {
    await authApi.login(username, password);
    setUser(await authApi.me());
  }

  function logout() {
    clearTokens();
  }

  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
