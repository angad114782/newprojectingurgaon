'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5008/api';

interface AdminCtx {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
  authH: () => Record<string, string>;
  ready: boolean;
}

const Ctx = createContext<AdminCtx | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTokenState(localStorage.getItem('admin_token'));
    setReady(true);
  }, []);

  const setToken = (t: string | null) => {
    if (t) localStorage.setItem('admin_token', t);
    else localStorage.removeItem('admin_token');
    setTokenState(t);
  };

  const logout = () => setToken(null);

  const authH = useCallback((): Record<string, string> => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token]);

  return <Ctx.Provider value={{ token, setToken, logout, authH, ready }}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}
