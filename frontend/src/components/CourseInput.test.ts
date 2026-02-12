import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Router } from "vue-router";
import type { Pinia } from "pinia";
import CourseInput from "./CourseInput.vue";
import * as api from "@/api/mock/courses";
import { createTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";

describe("CourseInput.vue", () => {
  let pinia: Pinia;
  let router: Router;

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

    // getCourseSummaries()

    const wrapper = mount(CourseInput, {
      global: { plugins: [pinia, router] },
    });
    wrapper.find("input").setValue("Test Course");
    wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    // expect(wrapper.text()).toContain("Current course: Test Course");
  });

  it("displays error message when API rejects", async () => {
    vi.spyOn(api, "submitCourseName").mockRejectedValue(new Error("API error"));
    const wrapper = mount(CourseInput, {
      global: { plugins: [pinia, router] },
    });
    // Write to the button
    wrapper.find("input").setValue("Test Course");
    // Try to submit
    wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    // Expect that the text contains the error
    wrapper.find("#course-creation-error");
    expect(wrapper.text()).toContain("Failed to create course");
  });
});
