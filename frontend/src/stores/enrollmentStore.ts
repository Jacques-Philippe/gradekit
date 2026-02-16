import { defineStore } from "pinia";
import type { Enrollment } from "@/types/enrollment";
import {
  createEnrollment as createEnrollmentApi,
  getEnrollments as getEnrollmentsApi,
  getEnrollmentById as getEnrollmentByIdApi,
  deleteEnrollment as deleteEnrollmentApi,
} from "@/api/mock/enrollment";
import { toErrorMessage } from "@/utils/error";

export const useEnrollmentStore = defineStore("enrollment", {
  state: () => ({
    error: "" as string,
    loading: false,
  }),
  actions: {
    async getEnrollments(): Promise<Enrollment[]> {
      this.loading = true;
      this.error = "";
      try {
        // mock API call returns id + name
        return await getEnrollmentsApi();
      } catch (err) {
        this.error = `Failed to load enrollments ${toErrorMessage(err)}`;
        return [];
      } finally {
        this.loading = false;
      }
    },
    async getEnrollmentById(id: string): Promise<Enrollment | null> {
      this.loading = true;
      this.error = "";
      try {
        return await getEnrollmentByIdApi(id);
      } catch (err) {
        this.error = `Failed to load enrollment ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createEnrollment(
      studentId: string,
      courseId: string,
    ): Promise<Enrollment | null> {
      this.loading = true;
      this.error = "";

      try {
        return await createEnrollmentApi(studentId, courseId);
      } catch (err) {
        this.error = `Failed to create enrollment ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteEnrollment(id: string): Promise<Enrollment | null> {
      this.loading = true;
      this.error = "";
      try {
        return await deleteEnrollmentApi(id);
      } catch (err) {
        this.error = `Failed to delete enrollment ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
