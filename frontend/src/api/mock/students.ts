import type { Student, StudentSummary } from "@/types/student";

// A fake list of all students
// Note: this object can be mutated, it just can't be reassigned
const students: Record<string, Student> = {
  qwe: { id: "qwe", fullName: "John Doe", courses: ["abc", "def"] },
  asd: { id: "asd", fullName: "Jane Smith", courses: ["abc"] },
  zxc: { id: "zxc", fullName: "Bob Johnson", courses: ["def", "ghi"] },
};
// return id + name for dropdown/list
export async function getStudentSummaries(): Promise<StudentSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return Object.values(students).map(({ id, fullName, courses }) => ({
    id,
    fullName,
    courses,
  }));
}

export async function getStudentSummariesForCourse(
  courseId: string,
): Promise<StudentSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // get all students in the course, return id + name
  return Object.values(students)
    .filter((s) => s.courses?.includes(courseId))
    .map(({ id, fullName, courses }) => ({ id, fullName, courses }));
}

// return full student by id
export async function getStudentById(id: string): Promise<Student> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const student = students[id];
  if (!student) throw new Error(`Student with id ${id} not found`);
  return student;
}

// submit new student
export async function createStudent(fullName: string): Promise<Student> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedName = fullName.trim();
  if (!normalizedName) {
    throw new Error("Student name is required");
  }

  // check for duplicates
  const exists = Object.values(students).some(
    (s) => s.fullName.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (exists) {
    throw new Error(`Student with name "${normalizedName}" already exists`);
  }

  // create and add new student
  const id = Math.random().toString(36).substring(2, 9);
  const student: Student = { id, fullName: normalizedName };
  students[id] = student;
  return student;
}

// delete student
export async function deleteStudent(id: string): Promise<Student> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const student = students[id];
  if (!student) {
    throw new Error(`Student with id ${id} not found`);
  }
  delete students[id];
  return student;
}
