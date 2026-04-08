import { type ApiResult, err, ok } from "@/types/apiResult";
import { apiFetch, parseError } from "@/api/apiFetch";

export interface Deadline {
  assignment_id: number;
  assignment_title: string;
  course_id: number;
  course_name: string;
  due_date: string;
}

export async function apiGetDeadlines(): Promise<ApiResult<Deadline[]>> {
  const res = await apiFetch("/deadlines");
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}
