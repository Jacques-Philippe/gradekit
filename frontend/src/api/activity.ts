import { type ApiResult, err, ok } from "@/types/apiResult";
import { apiFetch, parseError } from "@/api/apiFetch";

export interface ActivityEvent {
  id: number;
  event_type: string;
  payload: string;
  created_at: string;
}

export async function apiGetActivity(): Promise<ApiResult<ActivityEvent[]>> {
  const res = await apiFetch("/activity");
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}
