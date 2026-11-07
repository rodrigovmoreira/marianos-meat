import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  clearStoredToken,
  fetchMe,
  getStoredToken,
  isUnauthorized,
  storeToken,
  type AccessState,
  type UserInfo,
} from '../lib/api';
import { buildSsoLoginUrl, clearTokenFromUrl, readTokenFromLocation } from '../lib/sso';
import { AuthContext } from './auth-context';

/**
 * Lê o token já na inicialização do estado: o SSO devolve o JWT na returnUrl
 * e ele precisa estar disponível antes do primeiro fetch.
 */
const readInitialToken = () => {
  const tokenFromUrl = readTokenFromLocation();

  if (!tokenFromUrl) return getStoredToken();

  storeToken(tokenFromUrl);
  clearTokenFromUrl();
  return tokenFromUrl;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readInitialToken);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [access, setAccess] = useState<AccessState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const current = getStoredToken();

    if (!current) {
      setToken(null);
      setUser(null);
      setAccess(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchMe();
      setToken(current);
      setUser(data.user);
      setAccess(data.access);
    } catch (requestError) {
      // Token inválido/expirado: descarta a sessão local e deixa a UI mandar para o SSO.
      if (isUnauthorized(requestError)) {
        clearStoredToken();
        setToken(null);
        setUser(null);
        setAccess(null);
      } else {
        setError('Não foi possível validar seu acesso agora. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;

    // O await inicial mantém as atualizações de estado fora do corpo síncrono do efeito.
    const bootstrap = async () => {
      await Promise.resolve();
      if (ativo) await refresh();
    };

    void bootstrap();

    return () => {
      ativo = false;
    };
  }, [refresh]);

  const signOut = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
    setAccess(null);
  }, []);

  const goToLogin = useCallback(() => {
    window.location.assign(buildSsoLoginUrl());
  }, []);

  const value = useMemo(
    () => ({ token, user, access, loading, error, refresh, signOut, goToLogin }),
    [token, user, access, loading, error, refresh, signOut, goToLogin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
