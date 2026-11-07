import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'marianos-meat.token';

// O backend expõe apenas /api/v1 (ADR 002), então a baseURL já carrega o prefixo.
const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3020/api/v1';

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);
export const storeToken = (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token);
export const clearStoredToken = () => localStorage.removeItem(TOKEN_STORAGE_KEY);

export const api = axios.create({ baseURL });

// O token vem do Squamata-Login e é apenas encaminhado — este app nunca emite identidade.
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface UserInfo {
  email: string | null;
  name: string | null;
}

export interface AccessState {
  registered: boolean;
  status: 'nao_cadastrado' | 'pendente' | 'aprovado' | 'rejeitado';
  role: 'super_admin' | 'editor' | null;
  isActive: boolean | null;
  canAccessPanel: boolean;
}

export interface MeResponse {
  success: boolean;
  user: UserInfo;
  access: AccessState;
}

export const fetchMe = async (): Promise<MeResponse> => (await api.get<MeResponse>('/auth/me')).data;

export const requestAccess = async () => (await api.post('/auth/solicitar')).data;

export const isUnauthorized = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

/** Extrai a mensagem de erro do contrato { success:false, error:{ code, message } }. */
export const getApiErrorMessage = (error: unknown, fallback = 'Não foi possível concluir a operação.') => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: { message?: string } } | undefined;
    return data?.error?.message ?? fallback;
  }
  return fallback;
};
