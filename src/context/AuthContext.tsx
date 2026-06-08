import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'supplier';

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  // For supplier role, optionally link to a supplier id (e.g. NYLtex)
  supplierId?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => { success: boolean; message?: string };
  logout: () => void;
}

const STORAGE_KEY = 'material_library_auth_user';

// Predefined accounts (mock - no real backend)
const ACCOUNTS: Array<{ user: User; password: string }> = [
  {
    user: {
      id: 'u-admin-001',
      username: 'admin',
      displayName: 'System Administrator',
      role: 'admin',
    },
    password: 'admin123',
  },
  {
    user: {
      id: 'u-sup-006',
      username: 'nyltex',
      displayName: 'NYLtex',
      role: 'supplier',
      supplierId: 'sup-006',
    },
    password: 'nyltex123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((credentials: AuthCredentials) => {
    const account = ACCOUNTS.find(
      (a) => a.user.username === credentials.username.trim() && a.password === credentials.password
    );
    if (!account) {
      return { success: false, message: 'Invalid username or password' };
    }
    setUser(account.user);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Permission helper
export function canAccess(user: User | null, path: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;

  // Supplier - cannot access these
  const restricted = ['/suppliers', '/logs', '/settings'];
  return !restricted.includes(path);
}

export function getRestrictedPaths(role: UserRole): string[] {
  if (role === 'admin') return [];
  // Supplier
  return ['/suppliers', '/logs', '/settings'];
}
