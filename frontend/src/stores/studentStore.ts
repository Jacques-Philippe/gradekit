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
    currentStudent: null as Student | null,
  }),
  actions: {
    async getStudents(): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getStudentsApi();
      if (result.ok) {
        this.students = result.data;
      } else {
        this.error = `Failed to load students: ${result.error}`;
        this.students = [];
      }
      this.loading = false;
    },
    async getStudentsForIdsApi(studentIds: string[]): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getStudentsForIdsApi(studentIds);
      if (result.ok) {
        this.students = result.data;
      } else {
        this.error = `Failed to load students: ${result.error}`;
        this.students = [];
      }
      this.loading = false;
    },
    async getStudentById(id: string): Promise<Student | null> {
      this.loading = true;
      this.error = "";
      const result = await getStudentByIdApi(id);
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to load student: ${result.error}`;
      return null;
    },
    async createStudent(name: string): Promise<Student | null> {
      this.loading = true;
      this.error = "";
      const result = await createStudentApi(name);
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to create student: ${result.error}`;
      return null;
    },
    async deleteStudent(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await deleteStudentApi(id);
      this.loading = false;
      if (result.ok) return;
      this.error = `Failed to delete student: ${result.error}`;
    },
    clearError() {
      this.error = "";
    },
  },
});
