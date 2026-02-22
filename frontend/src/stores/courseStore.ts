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
      const result = await getCoursesApi();
      if (result.ok) {
        this.courses = result.data;
      } else {
        this.error = `Failed to load courses: ${result.error}`;
        this.courses = [];
      }
      this.loading = false;
    },
    async getCourseById(id: string): Promise<Course | null> {
      this.loading = true;
      this.error = "";
      const result = await getCourseByIdApi(id);
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to load course: ${result.error}`;
      return null;
    },
    async createCourse(
      name: string,
      description?: string,
    ): Promise<Course | null> {
      this.loading = true;
      this.error = "";
      const result = await createCourseApi(name, description);
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to create course: ${result.error}`;
      return null;
    },
    async deleteCourse(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await deleteCourseApi(id);
      this.loading = false;
      if (result.ok) return;
      this.error = `Failed to delete course: ${result.error}`;
    },
    async selectCourse(id: string): Promise<Course | null> {
      this.loading = true;
      this.error = "";
      const result = await getCourseByIdApi(id);
      this.loading = false;
      if (result.ok) {
        this.currentCourse = result.data;
        return result.data;
      }
      this.error = `Failed to load course: ${result.error}`;
      return null;
    },
    clearCurrentCourse(): void {
      this.currentCourse = null;
      this.error = "";
    },
  },
});
