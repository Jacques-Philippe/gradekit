import { defineStore } from "pinia";
import type { Course } from "@/types/course";
import {
  createCourse as createCourseApi,
  getCourses as getCoursesApi,
  getCourseById as getCourseByIdApi,
  deleteCourse as deleteCourseApi,
} from "@/api/mock/courses";

export const useCourseStore = defineStore("course", {
  state: () => ({
    error: "" as string,
    loading: false,
    courses: [] as Course[],
    currentCourse: null as Course | null,
  }),
  actions: {
    async getCourses(): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getCoursesApi();
        if (result.ok) {
          this.courses = result.data;
        } else {
          this.error = `Failed to load courses: ${result.error}`;
          this.courses = [];
        }
      } catch {
        this.error = "Failed to load courses: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async getCourseById(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getCourseByIdApi(id);
        this.loading = false;
        if (result.ok) {
          this.currentCourse = result.data;
        } else {
          this.error = `Failed to load course: ${result.error}`;
          this.currentCourse = null;
        }
      } catch {
        this.error = "Failed to load course: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async createCourse(name: string, description?: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await createCourseApi(name, description);
        this.loading = false;
        if (result.ok) {
          this.courses = [...this.courses, result.data];
          return;
        }
        this.error = `Failed to create course: ${result.error}`;
      } catch {
        this.error = "Failed to create course: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async deleteCourse(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await deleteCourseApi(id);
        this.loading = false;
        if (result.ok) {
          this.courses = this.courses.filter((c) => c.id !== id);
          return;
        } else {
          this.error = `Failed to delete course: ${result.error}`;
        }
      } catch {
        this.error = "Failed to delete course: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async selectCourse(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getCourseByIdApi(id);
        this.loading = false;
        if (result.ok) {
          this.currentCourse = result.data;
          return;
        }
        this.error = `Failed to select course: ${result.error}`;
      } catch {
        this.error = "Failed to select course: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    clearCurrentCourse(): void {
      this.currentCourse = null;
      this.error = "";
    },
  },
});
