import { type Enrollment } from "@/types/enrollment";
import { type ApiResult, err, ok } from "@/types/apiResult";

let enrollments: Array<Enrollment> = [
  {
    id: "enrollment1",
    studentId: "student1",
    courseId: "course1",
  },
  {
    id: "enrollment2",
    studentId: "student2",
    courseId: "course1",
  },
  {
    id: "enrollment3",
    studentId: "student2",
    courseId: "course2",
  },
];

export async function getEnrollments(): Promise<ApiResult<Enrollment[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ok(enrollments);
}

export async function getEnrollmentById(
  id: string,
): Promise<ApiResult<Enrollment>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const enrollment = enrollments.find((e) => e.id === id);
  if (!enrollment) return err(`Enrollment with id ${id} not found`);
  return ok({ ...enrollment });
}

export async function getEnrollmentByStudentAndCourse(
  studentId: string,
  courseId: string,
): Promise<ApiResult<Enrollment>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const enrollment = enrollments.find(
    (e) => e.studentId === studentId && e.courseId === courseId,
  );
  if (!enrollment) {
    return err(
      `Enrollment with studentId ${studentId} and courseId ${courseId} not found`,
    );
  }
  return ok({ ...enrollment });
}

export async function getEnrollmentsByCourse(
  courseId: string,
): Promise<ApiResult<Enrollment[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const enrollmentsForCourse = enrollments.filter(
    (e) => e.courseId === courseId,
  );
  return ok([...enrollmentsForCourse]);
}

export async function createEnrollment(
  studentId: string,
  courseId: string,
): Promise<ApiResult<Enrollment>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const id = Math.random().toString(36).substring(2, 9);
  const enrollment: Enrollment = { id, studentId, courseId };
  enrollments = [...enrollments, enrollment];
  return ok({ ...enrollment });
}

export async function deleteEnrollment(
  enrollmentId: string,
): Promise<ApiResult<Enrollment>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const enrollment = enrollments.find((e) => e.id === enrollmentId);
  if (!enrollment) {
    return err(`Enrollment with id ${enrollmentId} not found`);
  }
  enrollments = enrollments.filter((e) => e.id !== enrollmentId);
  return ok({ ...enrollment });
}
