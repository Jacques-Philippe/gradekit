import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import CourseView from "@/views/CourseView.vue";
import { useCourseStore } from "@/stores/courseStore";
import type { Course } from "@/types/course";

describe("CourseView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("shows fallback text when no course is selected", () => {
    const store = useCourseStore();
    store.currentCourse = null;

    const wrapper = mount(CourseView);

    expect(wrapper.text()).toContain("No course selected");
  });

  it("shows course title when a course is selected", () => {
    const store = useCourseStore();
    const courseName = "Math 101";
    store.currentCourse = {
      id: "abc123",
      name: courseName,
    } as Course;

    const wrapper = mount(CourseView);

    expect(wrapper.text()).toContain(courseName);
  });
});
