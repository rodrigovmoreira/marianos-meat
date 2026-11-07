const SSO_URL = import.meta.env.VITE_SSO_URL ?? 'http://localhost:5174';
const APP_SLUG = import.meta.env.VITE_APP_SLUG ?? 'marianos-meat';
const TENANT_ID = import.meta.env.VITE_TENANT_ID ?? 'default';

/**
 * Fluxo de SSO (Architecture.md §4.2): este app não tem formulário de login.
 * Ele redireciona para o Squamata-Login passando appSlug, tenantId e returnUrl.
 */
export const buildSsoLoginUrl = (returnPath = '/admin') => {
  const returnUrl = `${window.location.origin}${returnPath}`;
  const params = new URLSearchParams({ appSlug: APP_SLUG, tenantId: TENANT_ID, returnUrl });

  return `${SSO_URL.replace(/\/$/, '')}/login?${params.toString()}`;
};

/**
 * O SSO devolve o token na returnUrl. O formato exato do emissor ainda não está
 * documentado aqui, então aceitamos `token`/`access_token` na query ou no hash.
 */
export const readTokenFromLocation = () => {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  return search.get('token') ?? search.get('access_token') ?? hash.get('token');
};

/** Remove o token da URL depois de guardá-lo, para não deixá-lo no histórico. */
export const clearTokenFromUrl = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};
