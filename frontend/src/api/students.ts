import { type ApiResult, err, ok } from "@/types/apiResult";
import { apiFetch, parseError } from "@/api/apiFetch";

export interface Student {
  id: number;
  full_name: string;
}

export async function apiGetStudents(
  courseId: number,
): Promise<ApiResult<Student[]>> {
  const res = await apiFetch(`/courses/${courseId}/students`);
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}

export async function apiDeleteStudent(
  courseId: number,
  studentId: number,
): Promise<ApiResult<void>> {
  const res = await apiFetch(`/courses/${courseId}/students/${studentId}`, {
    method: "DELETE",
  });
  if (!res.ok) return err(await parseError(res));
  return ok(undefined);
}
