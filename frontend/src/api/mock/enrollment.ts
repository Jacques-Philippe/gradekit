import { type Enrollment } from "@/types/enrollment";

let enrollments: Array<Enrollment> = [
  {
    id: "enrollment1",
    studentId: "student1",
    courseId: "course1",
  },
];

export async function getEnrollments(): Promise<Enrollment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return enrollments;
}

// return full enrollment by id
export async function getEnrollmentById(id: string): Promise<Enrollment> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const enrollment = enrollments.find((e) => e.id === id);
  if (!enrollment) throw new Error(`Enrollment with id ${id} not found`);
  return { ...enrollment };
}

// submit new enrollment
export async function createEnrollment(
  studentId: string,
  courseId: string,
): Promise<Enrollment> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // create and add new enrollment
  const id = Math.random().toString(36).substring(2, 9);
  const enrollment: Enrollment = { id, studentId, courseId };
  enrollments = [...enrollments, enrollment];
  return { ...enrollment };
}

export async function deleteEnrollment(
  enrollmentId: string,
): Promise<Enrollment> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const enrollment = enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) {
    throw new Error(`Enrollment with id ${enrollmentId} not found`);
  }
  enrollments = enrollments.filter((e) => e.id !== enrollmentId);
  return { ...enrollment };
}
