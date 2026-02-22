import type { Student } from "@/types/student";
import { type ApiResult, err, ok } from "@/types/apiResult";

let students: Array<Student> = [
  { id: "student1", fullName: "John Doe" },
  { id: "student2", fullName: "Jane Smith" },
  { id: "student3", fullName: "Bob Johnson" },
];

export async function getStudents(): Promise<ApiResult<Student[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ok([...students]);
}

export async function getStudentsForIds(
  studentIds: string[],
): Promise<ApiResult<Student[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ok([...students.filter((s) => studentIds.includes(s.id))]);
}

export async function getStudentById(id: string): Promise<ApiResult<Student>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const student = students.find((s) => s.id === id);
  if (!student) return err(`Student with id ${id} not found`);
  return ok({ ...student });
}

export async function createStudent(
  fullName: string,
): Promise<ApiResult<Student>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedName = fullName.trim();
  if (!normalizedName) {
    return err("Student name is required");
  }

  const exists = students.some(
    (s) => s.fullName.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (exists) {
    return err(`Student with name "${normalizedName}" already exists`);
  }

  const id = Math.random().toString(36).substring(2, 9);
  const student: Student = { id, fullName: normalizedName };
  students = [...students, student];
  return ok({ ...student });
}

export async function deleteStudent(
  studentId: string,
): Promise<ApiResult<Student>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const student = students.find((s) => s.id === studentId);
  if (!student) {
    return err(`Student with id ${studentId} not found`);
  }
  students = students.filter((s) => s.id !== studentId);
  return ok({ ...student });
}
