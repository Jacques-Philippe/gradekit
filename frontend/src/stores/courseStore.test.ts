import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCourseStore } from "@/stores/courseStore";
import * as api from "@/api/mock/courses";
import type { Course, CourseSummary } from "@/types/course";

describe("courseStore", () => {
  let store: ReturnType<typeof useCourseStore>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useCourseStore();
  });

  describe("createCourse", () => {
    it("creates a course successfully", async () => {
      const mockCourse = { id: "abc123", name: "Test Course" };
      const spy = vi
        .spyOn(api, "submitCourseName")
        .mockResolvedValue(mockCourse);

      await store.createCourse("Test Course");

      expect(store.currentCourse).toEqual(mockCourse);
      expect(store.error).toBe("");

      spy.mockRestore();
    });

    it("sets error when creation fails", async () => {
      const spy = vi
        .spyOn(api, "submitCourseName")
        .mockRejectedValue(new Error("API error"));

      await store.createCourse("Fail Course");

      expect(store.currentCourse).toBeNull();
      expect(store.error).toContain("Failed to create course");

      spy.mockRestore();
    });
  });

  describe("fetchCourseSummaries", () => {
    it("loads course summaries successfully", async () => {
      const mockCourses: CourseSummary[] = [
        { id: "a", name: "Math 101" },
        { id: "b", name: "Physics 201" },
      ];

      vi.spyOn(api, "getCourseSummaries").mockResolvedValue(mockCourses);

      await store.fetchCourseSummaries();

      expect(store.courses).toEqual(mockCourses);
      expect(store.error).toBe("");
      expect(store.loading).toBe(false);
    });

    it("sets error when loading course summaries fails", async () => {
      vi.spyOn(api, "getCourseSummaries").mockRejectedValue(
        new Error("API failure"),
      );

      await store.fetchCourseSummaries();

      expect(store.courses).toEqual([]);
      expect(store.error).toContain("Failed to load courses");
      expect(store.loading).toBe(false);
    });
  });

  describe("selectCourse", () => {
    it("selects a course successfully", async () => {
      const mockCourse: Course = {
        id: "a",
        name: "Math 101",
      };

      vi.spyOn(api, "getCourseById").mockResolvedValue(mockCourse);

      await store.selectCourse("a");

      expect(store.currentCourse).toEqual(mockCourse);
      expect(store.error).toBe("");
      expect(store.loading).toBe(false);
    });

    it("sets error when selecting a course fails", async () => {
      vi.spyOn(api, "getCourseById").mockRejectedValue(new Error("Not found"));

      await store.selectCourse("missing-id");

      expect(store.currentCourse).toBeNull();
      expect(store.error).toContain("Failed to select course");
      expect(store.loading).toBe(false);
    });
  });
});
