import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useCourseStore } from "@/stores/courseStore";
import * as api from "@/api/mock/courses";
import type { Course, CourseSummary } from "@/types/course";
import { setupTestPinia } from "@/utils/piniaTestHelper";

describe("courseStore", () => {
  let store: ReturnType<typeof useCourseStore>;

  beforeEach(() => {
    setupTestPinia();
    store = useCourseStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createCourse", () => {
    it("creates a course successfully", async () => {
      const mockCourse = { id: "abc123", name: "Test Course" };
      vi.spyOn(api, "submitCourseName").mockResolvedValue(mockCourse);

      expect(store.courses).toEqual([]);

      const course = await store.createCourse("Test Course");

      expect(store.error).toBe("");

      expect(course?.id).toEqual(mockCourse.id);
      expect(course?.name).toEqual(mockCourse.name);
      expect(store.courses.filter((c) => c.id === mockCourse.id)).toHaveLength(
        1,
      );
    });

    it("sets error when creation fails", async () => {
      vi.spyOn(api, "submitCourseName").mockRejectedValue(
        new Error("API error"),
      );

      await store.createCourse("Fail Course");

      expect(store.currentCourse).toBeNull();
      expect(store.error).toContain("Failed to create course");
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

    it("resets selected course on course selection failed", async () => {
      // we successfully select a course, then we are unsuccessful
      // we expect for the selected course to be null
      const mockCourse: Course = {
        id: "a",
        name: "Math 101",
      };

      vi.spyOn(api, "getCourseById").mockResolvedValue(mockCourse);

      await store.selectCourse("a");

      expect(store.currentCourse).toEqual(mockCourse);
      expect(store.error).toBe("");
      expect(store.loading).toBe(false);

      vi.spyOn(api, "getCourseById").mockRejectedValue(new Error("Not found"));

      await store.selectCourse("a");

      expect(store.currentCourse).toBeNull();
      expect(store.error).toContain("Failed to select course");
      expect(store.loading).toBe(false);
    });
  });
});
