import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import CourseView from "@/views/CourseView.vue";
import { useCourseStore } from "@/stores/courseStore";
import type { Course } from "@/types/course";
import { createTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";

describe("CourseView", () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(async () => {
    pinia = setupTestPinia();
    router = createTestRouter();
    await router.push("/");
    await router.isReady();
  });

  it("shows fallback text when no course is selected", () => {
    const store = useCourseStore();
    store.currentCourse = null;

    const wrapper = mount(CourseView, {
      global: { plugins: [pinia, router] },
    });

    expect(wrapper.text()).toContain("No course selected");
  });

  it("shows course title when a course is selected", () => {
    const store = useCourseStore();
    const courseName = "Math 101";
    store.currentCourse = {
      id: "abc123",
      name: courseName,
    } as Course;

    const wrapper = mount(CourseView, {
      global: { plugins: [pinia, router] },
    });

    expect(wrapper.text()).toContain(courseName);
  });
});
