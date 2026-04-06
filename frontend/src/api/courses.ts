import { type ApiResult, err, ok } from "@/types/apiResult";
import { apiFetch, parseError } from "@/api/apiFetch";

export interface Course {
  id: number;
  name: string;
  description: string | null;
  due_date: string | null;
}

export async function apiGetCourse(id: number): Promise<ApiResult<Course>> {
  const res = await apiFetch(`/courses/${id}`);
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}

export async function apiGetCourses(): Promise<ApiResult<Course[]>> {
  const res = await apiFetch("/courses");
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}

export interface CreateCourseParams {
  name: string;
  description?: string;
  due_date?: string;
}

export async function apiCreateCourse(
  params: CreateCourseParams,
): Promise<ApiResult<Course>> {
  const res = await apiFetch("/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}
