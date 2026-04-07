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

export interface ApiError {
  detail: string;
  code?: string;
}

export async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = await res.json();
    const detail = body.detail;
    const code = body.code;
    if (detail == null) return { detail: res.statusText };
    if (typeof detail === "string") return { detail, code };
    if (Array.isArray(detail))
      return {
        detail: detail
          .map((e) => (typeof e === "object" && e?.msg ? e.msg : String(e)))
          .join(", "),
        code,
      };
    return { detail: JSON.stringify(detail), code };
  } catch {
    return { detail: res.statusText };
  }
}
