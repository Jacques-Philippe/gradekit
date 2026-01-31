import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCourseStore } from "@/stores/courseStore";
import * as api from "@/api/mock/courses";

describe("courseStore", () => {
  let store: ReturnType<typeof useCourseStore>;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    store = useCourseStore();
  });

  it("creates a course successfully", async () => {
    const mockCourse = { id: "abc123", name: "Test Course" };
    const spy = vi.spyOn(api, "submitCourseName").mockResolvedValue(mockCourse);

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
