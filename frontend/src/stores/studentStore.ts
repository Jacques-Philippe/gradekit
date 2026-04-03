import { defineStore } from "pinia";
import type { Student } from "@/types/student";
import {
  createStudent as createStudentApi,
  getStudents as getStudentsApi,
  getStudentsForIds as getStudentsForIdsApi,
  getStudentById as getStudentByIdApi,
  deleteStudent as deleteStudentApi,
} from "@/api/mock/students";
import { withLoading } from "@/utils/withLoading";

export const useStudentStore = defineStore("student", {
  state: () => ({
    error: "" as string,
    loading: false,
    students: [] as Student[],
    student: null as Student | null,
  }),
  actions: {
    async getStudents(): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to load students",
        getStudentsApi,
      );
      if (result.ok) {
        this.students = result.data;
      } else {
        this.students = [];
      }
    },
    async getStudentsForIdsApi(studentIds: string[]): Promise<void> {
      const result = await withLoading(this, "Failed to load students", () =>
        getStudentsForIdsApi(studentIds),
      );
      if (result.ok) {
        this.students = result.data;
      } else {
        this.students = [];
      }
    },
    async getStudentById(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to load student", () =>
        getStudentByIdApi(id),
      );
      if (result.ok) {
        this.student = result.data;
      } else {
        this.student = null;
      }
    },
    async createStudent(name: string): Promise<void> {
      const result = await withLoading(this, "Failed to create student", () =>
        createStudentApi(name),
      );
      if (result.ok) {
        this.students = [...this.students, result.data];
      }
    },
    async deleteStudent(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to delete student", () =>
        deleteStudentApi(id),
      );
      if (result.ok) {
        this.students = this.students.filter((s) => s.id !== id);
        if (this.student?.id === id) {
          this.student = null;
        }
      }
    },
    clearError() {
      this.error = "";
    },
  },
});
