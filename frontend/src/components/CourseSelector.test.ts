import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import CourseSelector from "@/components/CourseSelector.vue";
import * as api from "@/api/mock/courses";
import type { CourseSummary } from "@/types/course";
import { createTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";
import { useCourseStore } from "@/stores/courseStore";

describe("CourseSelector.vue", () => {
  let pinia: Pinia;
  let router: Router;

  const mockCourses: CourseSummary[] = [
    { id: "a", name: "Math 101" },
    { id: "b", name: "Physics 201" },
  ];

  beforeEach(async () => {
    pinia = setupTestPinia();
    router = createTestRouter();
    await router.push("/");
    await router.isReady();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables buttons while loading", async () => {
    // todo
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
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: true, // <-- important
    });

    const wrapper = mount(CourseSelector, {
      global: {
        plugins: [pinia, router],
      },
    });

    const store = useCourseStore();

    // Provide fake course list manually
    store.courses = [{ id: "a", name: "Course A" }];

    await wrapper.vm.$nextTick();

    const button = wrapper.find('[data-test="course-a"]');
    await button.trigger("click");

    expect(store.selectCourse).toHaveBeenCalledWith("a");
  });
});
