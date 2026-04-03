import { type ApiResult, err, ok } from "@/types/apiResult";
import { parseError } from "@/api/apiFetch";

export interface AuthUser {
  id: number;
  username: string;
}

export async function apiRegister(
  username: string,
  password: string,
): Promise<ApiResult<{ token: string }>> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}

export async function apiLogin(
  username: string,
  password: string,
): Promise<ApiResult<{ token: string }>> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}

export async function apiMe(token: string): Promise<ApiResult<AuthUser>> {
  const res = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}
