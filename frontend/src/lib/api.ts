const API_BASE = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || 'http://api-gateway:8080')  // SSR: call gateway directly
  : '';  // Browser: relative path, handled by nginx or next.config rewrites

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  get: <T>(url: string, token?: string) => request<T>(url, { method: 'GET', token }),
  post: <T>(url: string, body: unknown, token?: string) => request<T>(url, { method: 'POST', body: JSON.stringify(body), token }),
  put: <T>(url: string, body: unknown, token?: string) => request<T>(url, { method: 'PUT', body: JSON.stringify(body), token }),
  del: <T>(url: string, token?: string) => request<T>(url, { method: 'DELETE', token }),
};
