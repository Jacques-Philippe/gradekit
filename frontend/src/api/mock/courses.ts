import type { Course, CourseSummary } from "@/types/course";

// A fake list of all courses
// Note: this object can be mutated, it just can't be reassigned
const courses: Record<string, Course> = {
  abc: { id: "abc", name: "Math 101" },
  def: { id: "def", name: "Math 102" },
  ghi: { id: "ghi", name: "Geography 201" },
};
// return id + name for dropdown/list
export async function getCourseSummaries(): Promise<CourseSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return Object.values(courses).map(({ id, name }) => ({ id, name }));
}

// return full course by id
export async function getCourseById(id: string): Promise<Course> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const course = courses[id];
  if (!course) throw new Error(`Course with id ${id} not found`);
  return course;
}

// submit new course
export async function submitCourseName(name: string): Promise<Course> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // check for duplicates
  const exists = Object.values(courses).some(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
  if (exists) {
    throw new Error(`Course with name "${name}" already exists`);
  }

  // create and add new course
  const id = Math.random().toString(36).substring(2, 9);
  const course: Course = { id, name };
  courses[id] = course;
  return course;
}
