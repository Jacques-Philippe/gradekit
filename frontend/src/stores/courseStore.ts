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
  }),
  actions: {
    async getCourses(): Promise<Course[]> {
      this.loading = true;
      this.error = "";
      try {
        // mock API call returns id + name
        return await getCoursesApi();
      } catch (err) {
        this.error = `Failed to load courses ${toErrorMessage(err)}`;
        return [];
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
  },
});
