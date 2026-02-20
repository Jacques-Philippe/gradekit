import type { Course } from "@/types/course";

// A fake list of all courses
let courses: Array<Course> = [
  { id: "course1", name: "Math 101" },
  { id: "def", name: "Math 102" },
  { id: "ghi", name: "Geography 201" },
];
// return id + name for dropdown/list
export async function getCourses(): Promise<Course[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...courses];
}

// return full course by id
export async function getCourseById(id: string): Promise<Course> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const course = courses.find((c) => c.id === id);
  if (!course) throw new Error(`Course with id ${id} not found`);
  return { ...course };
}

// submit new course
export async function createCourse(
  name: string,
  description?: string,
): Promise<Course> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedName = name.trim();
  if (!normalizedName) {
    throw new Error("Course name is required");
  }

  // check for duplicates
  const exists = courses.some(
    (c) => c.name.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (exists) {
    throw new Error(`Course with name "${name}" already exists`);
  }

  // create and add new course
  const id = Math.random().toString(36).substring(2, 9);
  const course: Course = { id, name: normalizedName, description };
  courses = [...courses, course];
  return { ...course };
}

export async function deleteCourse(id: string): Promise<Course> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const course = courses.find((c) => c.id === id);
  if (!course) {
    throw new Error(`Course with id ${id} not found`);
  }
  courses = courses.filter((c) => c.id !== id);
  return { ...course };
}
