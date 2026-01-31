import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CourseInput from "./CourseInput.vue";
import * as api from "@/api/mock/courses";

describe("CourseInput.vue", () => {
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
    const mockCourse = { id: "abc123", name: "Test Course" };
    const spy = vi.spyOn(api, "submitCourseName").mockResolvedValue(mockCourse);

    const wrapper = mount(CourseInput);
    await wrapper.find("input").setValue("Test Course");
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(spy).toHaveBeenCalledWith("Test Course");
    expect(wrapper.text()).toContain(
      "Course submitted: Test Course (id: abc123)",
    );
    expect(wrapper.vm.isError).toBe(false);

    spy.mockRestore();
  });

  it("displays error message when API rejects", async () => {
    const spy = vi
      .spyOn(api, "submitCourseName")
      .mockRejectedValue(new Error("API error"));

    const wrapper = mount(CourseInput);
    await wrapper.find("input").setValue("Fail Course");
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(spy).toHaveBeenCalledWith("Fail Course");
    expect(wrapper.text()).toContain("Error submitting course");
    expect(wrapper.vm.isError).toBe(true);

    spy.mockRestore();
  });
});
