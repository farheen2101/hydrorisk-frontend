import { createContext, useContext, useEffect, useState } from "react";

// The backend (main.py) has no auth endpoints yet - there's no /users
// table or /login route. This context keeps sign in / sign up working as
// a real UI flow (with validation, persisted session) while staying
// backend-agnostic. Swap `fakeLogin`/`fakeSignup` for real API calls once
// an auth route exists.

const AuthContext = createContext(null);

const STORAGE_KEY = "hydrorisk.session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  function signIn({ name, email }) {
    setUser({ name: name || email.split("@")[0], email });
  }

  function signUp({ name, email }) {
    setUser({ name, email });
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
