import { getSession } from "next-auth/react";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const session = await getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return data;
};

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    return handleResponse<T>(response);
  },

  post: async <T, R = T>(url: string, body: T): Promise<R> => {
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<R>(response);
  },

  put: async <T, R = T>(url: string, body: T): Promise<R> => {
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<R>(response);
  },

  delete: async <T = void>(url: string): Promise<T> => {
    const headers = await getAuthHeaders();
    delete headers["Content-Type"];
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });
    return handleResponse<T>(response);
  },
};
