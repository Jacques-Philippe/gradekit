import { defineStore } from "pinia";
import type { Student, StudentSummary } from "@/types/student";
import {
  createStudent,
  getStudentSummaries,
  deleteStudent,
  getStudentSummariesForCourse,
} from "@/api/mock/students";
import { toErrorMessage } from "@/utils/error";

export const useStudentStore = defineStore("student", {
  state: () => ({
    students: [] as StudentSummary[], // just id + name
    error: "" as string,
    loading: false,
  }),
  actions: {
    async fetchStudentSummaries(): Promise<StudentSummary[] | null> {
      this.loading = true;
      this.error = "";
      try {
        const summaries = await getStudentSummaries();
        this.students = summaries;
        return summaries;
      } catch (err) {
        this.error = `Failed to load students ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async fetchStudentSummariesForCourse(
      courseId: string,
    ): Promise<StudentSummary[] | null> {
      this.loading = true;
      this.error = "";
      try {
        const summaries = await getStudentSummariesForCourse(courseId);
        this.students = summaries;
        return summaries;
      } catch (err) {
        this.error = `Failed to load students for course ${courseId} ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createStudent(name: string): Promise<Student | null> {
      this.loading = true;
      this.error = "";
      try {
        const student = await createStudent(name);
        this.students.push({ id: student.id, fullName: student.fullName });
        return student;
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
        const student = await deleteStudent(id);
        this.students = this.students.filter((s) => s.id !== id);
        return student;
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
