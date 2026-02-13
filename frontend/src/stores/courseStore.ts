import { defineStore } from "pinia";
import type { Course, CourseSummary } from "@/types/course";
import {
  submitCourseName,
  getCourseSummaries,
  getCourseById,
} from "@/api/mock/courses";
import { toErrorMessage } from "@/utils/error";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courses: [] as CourseSummary[], // just id + name
    currentCourse: null as Course | null,
    error: "" as string,
    loading: false,
  }),
  actions: {
    async fetchCourseSummaries() {
      this.loading = true;
      this.error = "";
      try {
        // mock API call returns id + name
        this.courses = await getCourseSummaries();
      } catch (err) {
        this.error = `Failed to load courses ${toErrorMessage(err)}`;
      } finally {
        this.loading = false;
      }
    },
    async selectCourse(id: string) {
      this.loading = true;
      this.error = "";
      try {
        // fetch full course object only for selected course
        this.currentCourse = await getCourseById(id);
      } catch (err) {
        this.error = `Failed to select course ${toErrorMessage(err)}`;
        this.currentCourse = null;
      } finally {
        this.loading = false;
      }
    },
    async createCourse(name: string): Promise<Course | null> {
      this.loading = true;
      this.error = "";

      try {
        const course = await submitCourseName(name);
        this.courses.push({ id: course.id, name: course.name });
        return course;
      } catch (err) {
        this.error = `Failed to create course ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    clearCourse() {
      this.currentCourse = null;
      this.error = "";
    },
  },
  getters: {
    hasCourse: (state) => !!state.currentCourse,
  },
});
