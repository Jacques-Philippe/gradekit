import { useAuthStore } from "@/stores/authStore";

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const authStore = useAuthStore();
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (authStore.token) {
    headers.set("Authorization", `Bearer ${authStore.token}`);
  }
  return fetch(`/api${path}`, { ...init, headers });
}

export async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    const detail = body.detail;
    if (detail == null) return res.statusText;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
      return detail
        .map((e) => (typeof e === "object" && e?.msg ? e.msg : String(e)))
        .join(", ");
    return JSON.stringify(detail);
  } catch {
    return res.statusText;
  }
}
