/*
 * Shared fetch helpers for the Coinbase clone frontend.
 * Centralizes the API base URL and JSON request handling.
 */
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = "/api";

export const API_BASE_URL = (configuredApiUrl || fallbackApiUrl).replace(/\/$/, "");

type ApiOptions = RequestInit & {
  credentials?: RequestCredentials;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      credentials: "include",
      ...options,
    });
  } catch {
    throw new Error(`Unable to reach backend at ${API_BASE_URL}`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data as T;
}