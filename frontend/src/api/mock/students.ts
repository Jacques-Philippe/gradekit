import type { Student } from "@/types/student";

let students: Array<Student> = [
  { id: "student1", fullName: "John Doe" },
  { id: "student2", fullName: "Jane Smith" },
  { id: "student3", fullName: "Bob Johnson" },
];
// return id + name for dropdown/list
export async function getStudents(): Promise<Student[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...students];
}

export async function getStudentsForIds(
  studentIds: string[],
): Promise<Student[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...students.filter((s) => studentIds.includes(s.id))];
}

// return full student by id
export async function getStudentById(id: string): Promise<Student> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const student = students.find((s) => s.id === id);
  if (!student) throw new Error(`Student with id ${id} not found`);
  return { ...student };
}

// create enw student
export async function createStudent(fullName: string): Promise<Student> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedName = fullName.trim();
  if (!normalizedName) {
    throw new Error("Student name is required");
  }

  // check for duplicates
  const exists = students.some(
    (s) => s.fullName.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (exists) {
    throw new Error(`Student with name "${normalizedName}" already exists`);
  }

  // create and add new student
  const id = Math.random().toString(36).substring(2, 9);
  const student: Student = { id, fullName: normalizedName };
  students = [...students, student];
  return { ...student };
}

// function normalizeStudentName(name: string): string {
//   return name.trim().toLowerCase();
// }

// // create enw student
// export async function addStudentToCourse(
//   fullName: string,
//   courseId: string,
// ): Promise<Student> {
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   // if the student exists already, just add the course to their list
//   const existing = Object.values(students).find(
//     (s) => normalizeStudentName(s.fullName) === normalizeStudentName(fullName),
//   );
//   if (existing) {
//     if (!existing.courses?.includes(courseId)) {
//       existing.courses = [...(existing.courses || []), courseId];
//     }
//     return existing;
//   } else {
//     // if student doesn't exist, create new one
//     return createStudent(fullName, [courseId]);
//   }
// }

// // delete student
// export async function removeStudentFromCourse(
//   studentId: string,
//   courseId: string,
// ): Promise<Student> {
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   const student = students[studentId];
//   if (!student) {
//     throw new Error(`Student with id ${studentId} not found`);
//   }
//   student.courses = student.courses?.filter((c) => c !== courseId);
//   return { ...student };
// }

export async function deleteStudent(studentId: string): Promise<Student> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const student = students.find((s) => s.id === studentId);
  if (!student) {
    throw new Error(`Student with id ${studentId} not found`);
  }
  students = students.filter((s) => s.id !== studentId);
  return { ...student };
}
