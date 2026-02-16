import { defineStore } from "pinia";
import type { Student } from "@/types/student";
import {
  createStudent as createStudentApi,
  getStudents as getStudentsApi,
  getStudentById as getStudentByIdApi,
  deleteStudent as deleteStudentApi,
} from "@/api/mock/students";
import { toErrorMessage } from "@/utils/error";

export const useStudentStore = defineStore("student", {
  state: () => ({
    error: "" as string,
    loading: false,
  }),
  actions: {
    async getStudents(): Promise<Student[]> {
      this.loading = true;
      this.error = "";
      try {
        return await getStudentsApi();
      } catch (err) {
        this.error = `Failed to load students ${toErrorMessage(err)}`;
        return [];
      } finally {
        this.loading = false;
      }
    },
    async getStudentById(id: string): Promise<Student | null> {
      this.loading = true;
      this.error = "";
      try {
        return await getStudentByIdApi(id);
      } catch (err) {
        this.error = `Failed to load student ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createStudent(name: string): Promise<Student | null> {
      this.loading = true;
      this.error = "";
      try {
        return await createStudentApi(name);
      } catch (err) {
        this.error = `Failed to create student ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteStudent(id: string): Promise<Student | null> {
      this.loading = true;
      this.error = "";
      try {
        return await deleteStudentApi(id);
      } catch (err) {
        this.error = `Failed to delete student ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    clearError() {
      this.error = "";
    },
  },
});
