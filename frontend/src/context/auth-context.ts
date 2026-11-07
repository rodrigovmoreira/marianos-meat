import { createContext, useContext } from 'react';

import type { AccessState, UserInfo } from '../lib/api';

export interface AuthContextValue {
  token: string | null;
  user: UserInfo | null;
  access: AccessState | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  signOut: () => void;
  goToLogin: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth precisa ser usado dentro de <AuthProvider>.');

  return context;
};
