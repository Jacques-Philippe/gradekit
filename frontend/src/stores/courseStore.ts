import { defineStore } from "pinia";
import type { Course } from "@/types/course";
import {
  createCourse as createCourseApi,
  getCourses as getCoursesApi,
  getCourseById as getCourseByIdApi,
  deleteCourse as deleteCourseApi,
} from "@/api/mock/courses";
import { toErrorMessage } from "@/utils/error";

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
        // mock API call returns id + name
        this.courses = await getCoursesApi();
      } catch (err) {
        this.error = `Failed to load courses ${toErrorMessage(err)}`;
        this.courses = [];
      } finally {
        this.loading = false;
      }
    },
    async getCourseById(id: string): Promise<Course | null> {
      this.loading = true;
      this.error = "";
      try {
        return await getCourseByIdApi(id);
      } catch (err) {
        this.error = `Failed to load course ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createCourse(
      name: string,
      description?: string,
    ): Promise<Course | null> {
      this.loading = true;
      this.error = "";

      try {
        return await createCourseApi(name, description);
      } catch (err) {
        this.error = `Failed to create course ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteCourse(id: string): Promise<Course | null> {
      this.loading = true;
      this.error = "";
      try {
        return await deleteCourseApi(id);
      } catch (err) {
        this.error = `Failed to delete course ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async selectCourse(id: string): Promise<Course | null> {
      this.loading = true;
      this.error = "";
      try {
        this.currentCourse = await getCourseByIdApi(id);
        return this.currentCourse;
      } catch (err) {
        this.error = `Failed to delete course ${toErrorMessage(err)}`;
        return null;
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
