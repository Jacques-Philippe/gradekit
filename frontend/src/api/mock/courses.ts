import type { Course } from "@/types/course";
import { type ApiResult, err, ok } from "@/types/apiResult";

let courses: Array<Course> = [
  { id: "course1", name: "Math 101" },
  { id: "course2", name: "Math 102" },
  { id: "course3", name: "Geography 201" },
];

export async function getCourses(): Promise<ApiResult<Course[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ok([...courses]);
}

export async function getCourseById(id: string): Promise<ApiResult<Course>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const course = courses.find((c) => c.id === id);
  if (!course) return err(`Course with id ${id} not found`);
  return ok({ ...course });
}

export async function createCourse(
  name: string,
  description?: string,
): Promise<ApiResult<Course>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedName = name.trim();
  if (!normalizedName) {
    return err("Course name is required");
  }

  const exists = courses.some(
    (c) => c.name.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (exists) {
    return err(`Course with name "${name}" already exists`);
  }

  const id = Math.random().toString(36).substring(2, 9);
  const course: Course = { id, name: normalizedName, description };
  courses = [...courses, course];
  return ok({ ...course });
}

export async function deleteCourse(id: string): Promise<ApiResult<Course>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const course = courses.find((c) => c.id === id);
  if (!course) {
    return err(`Course with id ${id} not found`);
  }
  courses = courses.filter((c) => c.id !== id);
  return ok({ ...course });
}
