/*
 * Shared fetch helpers for the Coinbase clone frontend.
 * Centralizes the API base URL and JSON request handling.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ApiOptions = RequestInit & {
  credentials?: RequestCredentials;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    credentials: "include",
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}