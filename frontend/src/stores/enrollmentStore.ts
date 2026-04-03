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
import { withLoading } from "@/utils/withLoading";

export const useEnrollmentStore = defineStore("enrollment", {
  state: () => ({
    error: "" as string,
    loading: false,
    enrollments: [] as Enrollment[],
    enrollment: null as Enrollment | null,
  }),
  actions: {
    async getEnrollments(): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to load enrollments",
        getEnrollmentsApi,
      );
      if (result.ok) {
        this.enrollments = result.data;
      } else {
        this.enrollments = [];
      }
    },
    async getEnrollmentById(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to load enrollment", () =>
        getEnrollmentByIdApi(id),
      );
      if (result.ok) {
        this.enrollment = result.data;
      } else {
        this.enrollment = null;
      }
    },
    async getEnrollmentByStudentAndCourse(
      studentId: string,
      courseId: string,
    ): Promise<void> {
      const result = await withLoading(this, "Failed to load enrollment", () =>
        getEnrollmentByStudentAndCourseApi(studentId, courseId),
      );
      if (result.ok) {
        this.enrollment = result.data;
      } else {
        this.enrollment = null;
      }
    },
    async getEnrollmentsByCourse(courseId: string): Promise<void> {
      const result = await withLoading(this, "Failed to load enrollments", () =>
        getEnrollmentsByCourseApi(courseId),
      );
      if (result.ok) {
        this.enrollments = result.data;
      } else {
        this.enrollments = [];
      }
    },
    async createEnrollment(studentId: string, courseId: string): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to create enrollment",
        () => createEnrollmentApi(studentId, courseId),
      );
      if (result.ok) {
        this.enrollments = [...this.enrollments, result.data];
      }
    },
    async deleteEnrollment(id: string): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to delete enrollment",
        () => deleteEnrollmentApi(id),
      );
      if (result.ok) {
        this.enrollments = this.enrollments.filter((e) => e.id !== id);
      }
    },
  },
});
