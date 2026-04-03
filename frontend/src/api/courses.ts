import { type ApiResult, err, ok } from "@/types/apiResult";
import { apiFetch, parseError } from "@/api/apiFetch";

export interface Course {
  id: number;
  name: string;
  description: string | null;
}

export async function apiGetCourses(): Promise<ApiResult<Course[]>> {
  const res = await apiFetch("/courses");
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}

export async function apiCreateCourse(
  name: string,
): Promise<ApiResult<Course>> {
  const res = await apiFetch("/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}
