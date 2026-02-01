import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia } from "pinia";
import { createRouter } from "vue-router";
import CourseSelector from "@/components/CourseSelector.vue";
import { useCourseStore } from "@/stores/courseStore";
import * as api from "@/api/mock/courses";
import type { CourseSummary } from "@/types/course";
import { createTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";

describe("CourseSelector.vue", () => {
  let pinia: ReturnType<typeof createPinia>;
  let store: ReturnType<typeof useCourseStore>;
  let router: ReturnType<typeof createRouter>;

  const mockCourses: CourseSummary[] = [
    { id: "a", name: "Math 101" },
    { id: "b", name: "Physics 201" },
  ];

  beforeEach(() => {
    pinia = setupTestPinia();
    store = useCourseStore();
    router = createTestRouter();
  });

  it("shows loading indicator while courses are being fetched", async () => {
    // mock fetch to never resolve immediately
    vi.spyOn(api, "getCourseSummaries").mockImplementation(
      () => new Promise(() => {}), // pending promise
    );

    const wrapper = mount(CourseSelector, {
      global: { plugins: [pinia, router] },
    });
    await wrapper.find("#courses-loading-indicator");

    expect(wrapper.text()).toContain("Loading courses");
  });

  it("renders course buttons after loading", async () => {
    vi.spyOn(api, "getCourseSummaries").mockResolvedValue(mockCourses);

    const wrapper = mount(CourseSelector, {
      global: { plugins: [pinia, router] },
    });

    // wait for fetch + render
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAll("button");
    expect(buttons.map((b) => b.text())).toEqual(["Math 101", "Physics 201"]);
  });

  it("selects a course when a button is clicked", async () => {
    vi.spyOn(api, "getCourseSummaries").mockResolvedValue(mockCourses);
    const selectSpy = vi.spyOn(store, "selectCourse").mockResolvedValue();

    const wrapper = mount(CourseSelector, {
      global: { plugins: [pinia, router] },
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const firstButton = wrapper.find('[data-test="course-a"]');
    await firstButton.trigger("click");

    expect(selectSpy).toHaveBeenCalledOnce();
    expect(selectSpy).toHaveBeenCalledWith("a");
  });
});
