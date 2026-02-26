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
    enrollment: null as Enrollment | null,
  }),
  actions: {
    async getEnrollments(): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getEnrollmentsApi();
        if (result.ok) {
          this.enrollments = result.data;
        } else {
          this.error = `Failed to load enrollments: ${result.error}`;
          this.enrollments = [];
        }
      } catch {
        this.error = `Failed to load enrollments: unexpected error`;
      } finally {
        this.loading = false;
      }
    },
    async getEnrollmentById(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getEnrollmentByIdApi(id);
        if (result.ok) {
          this.enrollment = result.data;
        } else {
          this.error = `Failed to load enrollment: ${result.error}`;
        }
      } catch {
        this.error = `Failed to load enrollment: unexpected error`;
      } finally {
        this.loading = false;
      }
    },
    async getEnrollmentByStudentAndCourse(
      studentId: string,
      courseId: string,
    ): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getEnrollmentByStudentAndCourseApi(
          studentId,
          courseId,
        );
        if (result.ok) {
          this.enrollment = result.data;
        } else {
          this.error = `Failed to load enrollment: ${result.error}`;
          this.enrollment = null;
        }
      } catch {
        this.error = `Failed to load enrollment: unexpected error`;
        this.enrollment = null;
      } finally {
        this.loading = false;
      }
    },
    async getEnrollmentsByCourse(courseId: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getEnrollmentsByCourseApi(courseId);
        if (result.ok) {
          this.enrollments = result.data;
        } else {
          this.error = `Failed to load enrollments: ${result.error}`;
          this.enrollments = [];
        }
      } catch {
        this.error = `Failed to load enrollments: unexpected error`;
        this.enrollments = [];
      } finally {
        this.loading = false;
      }
    },
    async createEnrollment(studentId: string, courseId: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await createEnrollmentApi(studentId, courseId);
        this.loading = false;
        if (result.ok) {
          this.enrollments = [...this.enrollments, result.data];
        } else {
          this.error = `Failed to create enrollment: ${result.error}`;
        }
      } catch {
        this.error = "Failed to create enrollment: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async deleteEnrollment(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await deleteEnrollmentApi(id);
        this.loading = false;
        if (result.ok) {
          this.enrollments = this.enrollments.filter((e) => e.id !== id);
        } else {
          this.error = `Failed to delete enrollment: ${result.error}`;
        }
      } catch {
        this.error = "Failed to delete enrollment: unexpected error";
      } finally {
        this.loading = false;
      }
    },
  },
});
