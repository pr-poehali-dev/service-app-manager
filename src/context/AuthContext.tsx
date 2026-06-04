import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/api/client';

 
export type UserRole = 'admin' | 'office' | 'brigade' | 'tech';

export interface AuthUser {
  id: number;
  name: string;
  login: string;
  role: UserRole;
  brigade_id: number | null;
  brigade_name: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isOffice: boolean;
  isField: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'service_pro_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const login = async (loginStr: string, password: string) => {
    const res = await api.login(loginStr, password);
    const u = res.user as AuthUser;
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAdmin: user?.role === 'admin',
      isOffice: user?.role === 'office',
      isField: user?.role === 'tech' || user?.role === 'brigade',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
