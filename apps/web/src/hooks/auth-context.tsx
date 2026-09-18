import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = { id: string; email: string; name: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = "watchlog.auth.token";
const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeUser(user: User): User {
  return { ...user, name: user.name || user.email.split("@")[0] };
}

async function readError(response: Response) {
  const body = (await response.json().catch(() => ({}))) as { message?: string };
  return body.message ?? "No se pudo completar la operación.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error(await readError(response));
        const body = (await response.json()) as { user: User };
        setUser(normalizeUser(body.user));
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path: "login" | "register", name: string, email: string, password: string) => {
    setError(null);
    const response = await fetch(`/api/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(path === "register" ? { name, email, password } : { email, password }),
    });
    if (!response.ok) {
      const message = await readError(response);
      setError(message);
      throw new Error(message);
    }
    const body = (await response.json()) as { user: User; token: string };
    localStorage.setItem(TOKEN_KEY, body.token);
    setUser(normalizeUser(body.user));
  };

  const logout = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) await fetch("/api/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, error, login: (email, password) => authenticate("login", "", email, password), register: (name, email, password) => authenticate("register", name, email, password), logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return value;
}