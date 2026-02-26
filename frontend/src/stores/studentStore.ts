import { defineStore } from "pinia";
import type { Student } from "@/types/student";
import {
  createStudent as createStudentApi,
  getStudents as getStudentsApi,
  getStudentsForIds as getStudentsForIdsApi,
  getStudentById as getStudentByIdApi,
  deleteStudent as deleteStudentApi,
} from "@/api/mock/students";

export const useStudentStore = defineStore("student", {
  state: () => ({
    error: "" as string,
    loading: false,
    students: [] as Student[],
    student: null as Student | null,
  }),
  actions: {
    async getStudents(): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getStudentsApi();
        if (result.ok) {
          this.students = result.data;
        } else {
          this.error = `Failed to load students: ${result.error}`;
          this.students = [];
        }
      } catch {
        this.error = "Failed to load students: unexpected error";
        this.students = [];
      } finally {
        this.loading = false;
      }
    },
    async getStudentsForIdsApi(studentIds: string[]): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getStudentsForIdsApi(studentIds);
        if (result.ok) {
          this.students = result.data;
        } else {
          this.error = `Failed to load students: ${result.error}`;
          this.students = [];
        }
      } catch {
        this.error = "Failed to load students: unexpected error";
        this.students = [];
      } finally {
        this.loading = false;
      }
    },
    async getStudentById(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getStudentByIdApi(id);
        this.loading = false;
        if (result.ok) {
          this.student = result.data;
        } else {
          this.error = `Failed to load student: ${result.error}`;
          this.student = null;
        }
      } catch {
        this.error = "Failed to load student: unexpected error";
        this.student = null;
      } finally {
        this.loading = false;
      }
    },
    async createStudent(name: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await createStudentApi(name);
        this.loading = false;
        if (result.ok) {
          this.students = [...this.students, result.data];
        } else {
          this.error = `Failed to create student: ${result.error}`;
        }
      } catch {
        this.error = "Failed to create student: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async deleteStudent(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await deleteStudentApi(id);
        if (result.ok) {
          this.students = this.students.filter((s) => s.id !== id);
          if (this.student?.id === id) {
            this.student = null;
          }
        } else {
          this.error = `Failed to delete student: ${result.error}`;
        }
      } catch {
        this.error = "Failed to delete student: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    clearError() {
      this.error = "";
    },
  },
});
