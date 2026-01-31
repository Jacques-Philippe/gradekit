import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import CourseInput from "./CourseInput.vue";
import * as api from "@/api/mock/courses";
import { useCourseStore } from "@/stores/courseStore";

describe("CourseInput.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders input and button", () => {
    const wrapper = mount(CourseInput);
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("updates v-model when typing", async () => {
    const wrapper = mount(CourseInput);
    const input = wrapper.find("input");
    await input.setValue("My Course");
    expect(wrapper.vm.courseName).toBe("My Course");
  });

  it("displays success message when API resolves", async () => {
    const store = useCourseStore();
    const mockCourse = { id: "abc123", name: "Test Course" };
    const spy = vi.spyOn(api, "submitCourseName").mockResolvedValue(mockCourse);

    await store.createCourse("Math 101");

    expect(store.currentCourse).toEqual(mockCourse);
    expect(store.error).toBe("");

    spy.mockRestore();
  });

  it("displays error message when API rejects", async () => {
    const store = useCourseStore();
    const spy = vi
      .spyOn(api, "submitCourseName")
      .mockRejectedValue(new Error("API error"));

    await store.createCourse("Fail Course");

    expect(store.currentCourse).toBeNull();
    expect(store.error).toBe("Failed to create course");
    spy.mockRestore();
  });
});
