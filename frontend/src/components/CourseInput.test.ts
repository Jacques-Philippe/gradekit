import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRouter } from "vue-router";
import { createPinia } from "pinia";
import CourseInput from "./CourseInput.vue";
import * as api from "@/api/mock/courses";
import { createTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";

describe("CourseInput.vue", () => {
  let pinia: ReturnType<typeof createPinia>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(async () => {
    pinia = setupTestPinia();
    router = createTestRouter();
    await router.push("/");
    await router.isReady();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("submits course successfully", async () => {
    const mockCourse = { id: "abc123", name: "Test Course" };
    vi.spyOn(api, "submitCourseName").mockResolvedValue(mockCourse);

    const wrapper = mount(CourseInput, {
      global: { plugins: [pinia, router] },
    });
    await wrapper.find("input").setValue("Test Course");
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Current course: Test Course");
  });

  it("displays error message when API rejects", async () => {
    vi.spyOn(api, "submitCourseName").mockRejectedValue(new Error("API error"));
    const wrapper = mount(CourseInput, {
      global: { plugins: [pinia, router] },
    });
    // Write to the button
    await wrapper.find("input").setValue("Test Course");
    // Try to submit
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();
    // Expect that the text contains the error
    await wrapper.find("#course-creation-error");
    expect(wrapper.text()).toContain("Failed to create course");
  });
});
