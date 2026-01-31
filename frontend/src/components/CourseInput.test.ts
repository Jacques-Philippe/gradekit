import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import CourseInput from "./CourseInput.vue";
import * as api from "@/api/mock/courses";
import { useCourseStore } from "@/stores/courseStore";

describe("CourseInput.vue", () => {
  let pinia: ReturnType<typeof createPinia>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
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

  it("submits course successfully", async () => {
    const mockCourse = { id: "abc123", name: "Test Course" };
    const spy = vi.spyOn(api, "submitCourseName").mockResolvedValue(mockCourse);

    const wrapper = mount(CourseInput, { global: { plugins: [pinia] } });
    await wrapper.find("input").setValue("Test Course");
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Course submitted: Test Course");

    spy.mockRestore();
  });

  it("displays error message when API rejects", async () => {
    const store = useCourseStore();
    const spy = vi
      .spyOn(api, "submitCourseName")
      .mockRejectedValue(new Error("API error"));

    await store.createCourse("Fail Course");

    expect(store.currentCourse).toBeNull();
    expect(store.error).toContain("Failed to create course");
    spy.mockRestore();
  });

  it("displays error message for course submission failed", async () => {
    const spy = vi
      .spyOn(api, "submitCourseName")
      .mockRejectedValue(new Error("API Error"));

    const wrapper = mount(CourseInput, { global: { plugins: [pinia] } });
    await wrapper.find("input").setValue("Test Course");
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    await wrapper.find("#course-creation-error");
    expect(wrapper.text()).toContain("API Error");

    spy.mockRestore();
  });
});
