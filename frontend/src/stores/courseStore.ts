import { defineStore } from "pinia";
import type { Course } from "@/types/course";
import {
  createCourse as createCourseApi,
  getCourses as getCoursesApi,
  getCourseById as getCourseByIdApi,
  deleteCourse as deleteCourseApi,
} from "@/api/mock/courses";
import { withLoading } from "@/utils/withLoading";

export const useCourseStore = defineStore("course", {
  state: () => ({
    error: "" as string,
    loading: false,
    courses: [] as Course[],
    currentCourse: null as Course | null,
  }),
  actions: {
    async getCourses(): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to load courses",
        getCoursesApi,
      );
      if (result.ok) {
        this.courses = result.data;
      } else {
        this.courses = [];
      }
    },
    async getCourseById(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to load course", () =>
        getCourseByIdApi(id),
      );
      if (result.ok) {
        this.currentCourse = result.data;
      } else {
        this.currentCourse = null;
      }
    },
    async createCourse(name: string, description?: string): Promise<void> {
      const result = await withLoading(this, "Failed to create course", () =>
        createCourseApi(name, description),
      );
      if (result.ok) {
        this.courses = [...this.courses, result.data];
      }
    },
    async deleteCourse(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to delete course", () =>
        deleteCourseApi(id),
      );
      if (result.ok) {
        this.courses = this.courses.filter((c) => c.id !== id);
      }
    },
    async selectCourse(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to select course", () =>
        getCourseByIdApi(id),
      );
      if (result.ok) {
        this.currentCourse = result.data;
      }
    },
    clearCurrentCourse(): void {
      this.currentCourse = null;
      this.error = "";
    },
  },
});
