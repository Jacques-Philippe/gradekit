import { useAuthStore } from "@/stores/authStore";

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const authStore = useAuthStore();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (authStore.token) {
    headers.set("Authorization", `Bearer ${authStore.token}`);
  }
  return fetch(`/api${path}`, { ...init, headers });
}

export async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.detail ?? res.statusText;
  } catch {
    return res.statusText;
  }
}
