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

export async function apiAddStudent(
  courseId: number,
  fullName: string,
): Promise<ApiResult<Student>> {
  const res = await apiFetch(`/courses/${courseId}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name: fullName }),
  });
  if (!res.ok) return err(await parseError(res));
  return ok(await res.json());
}

export interface ImportRowError {
  row: number;
  reason: string;
}

export interface ImportResult {
  created: Student[];
  errors: ImportRowError[];
}

export async function apiImportStudents(
  courseId: number,
  file: File,
): Promise<ApiResult<ImportResult>> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch(`/courses/${courseId}/students/import`, {
    method: "POST",
    body: form,
  });
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
