import { defineStore } from "pinia";
import type { Enrollment } from "@/types/enrollment";
import {
  createEnrollment as createEnrollmentApi,
  getEnrollments as getEnrollmentsApi,
  getEnrollmentById as getEnrollmentByIdApi,
  getEnrollmentByStudentAndCourse as getEnrollmentByStudentAndCourseApi,
  deleteEnrollment as deleteEnrollmentApi,
  getEnrollmentsByCourse as getEnrollmentsByCourseApi,
} from "@/api/mock/enrollment";

export const useEnrollmentStore = defineStore("enrollment", {
  state: () => ({
    error: "" as string,
    loading: false,
    enrollments: [] as Enrollment[],
  }),
  actions: {
    async getEnrollments(): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getEnrollmentsApi();
      if (result.ok) {
        this.enrollments = result.data;
      } else {
        this.error = `Failed to load enrollments: ${result.error}`;
        this.enrollments = [];
      }
      this.loading = false;
    },
    async getEnrollmentById(id: string): Promise<Enrollment | null> {
      this.loading = true;
      this.error = "";
      const result = await getEnrollmentByIdApi(id);
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to load enrollment: ${result.error}`;
      return null;
    },
    async getEnrollmentByStudentAndCourse(
      studentId: string,
      courseId: string,
    ): Promise<Enrollment | null> {
      this.loading = true;
      this.error = "";
      const result = await getEnrollmentByStudentAndCourseApi(
        studentId,
        courseId,
      );
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to load enrollment: ${result.error}`;
      return null;
    },
    async getEnrollmentsByCourse(courseId: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getEnrollmentsByCourseApi(courseId);
      if (result.ok) {
        this.enrollments = result.data;
      } else {
        this.error = `Failed to load enrollments: ${result.error}`;
        this.enrollments = [];
      }
      this.loading = false;
    },
    async createEnrollment(studentId: string, courseId: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await createEnrollmentApi(studentId, courseId);
      this.loading = false;
      if (result.ok) {
        this.enrollments = [...this.enrollments, result.data];
      } else {
        this.error = `Failed to create enrollment: ${result.error}`;
      }
    },
    async deleteEnrollment(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await deleteEnrollmentApi(id);
      this.loading = false;
      if (result.ok) {
        this.enrollments = this.enrollments.filter((e) => e.id !== id);
      } else {
        this.error = `Failed to delete enrollment: ${result.error}`;
      }
    },
  },
});
