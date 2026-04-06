import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import MyCourseView from "@/views/MyCoursesView.vue";
import { makeTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";
import * as coursesApi from "@/api/courses";

const COURSES = [
  { id: 1, name: "CS101", description: "Intro to CS" },
  { id: 2, name: "Math 201", description: null },
  { id: 3, name: "Physics 101", description: "Mechanics and waves" },
];

describe("MyCourseView", () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(async () => {
    pinia = setupTestPinia();
    router = makeTestRouter();
    await router.push("/courses");
    await router.isReady();
    vi.spyOn(coursesApi, "apiGetCourses").mockResolvedValue({
      ok: true,
      data: COURSES,
    });
  });

  it("renders the page heading", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    expect(wrapper.find("[data-testid='page-heading']").text()).toBe(
      "My Courses",
    );
  });

  it("renders a row for each course", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    expect(wrapper.find("[data-testid='course-row-1']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='course-row-2']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='course-row-3']").exists()).toBe(true);
  });

  it("shows empty state when there are no courses", async () => {
    vi.spyOn(coursesApi, "apiGetCourses").mockResolvedValue({
      ok: true,
      data: [],
    });
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    expect(wrapper.find("[data-testid='no-courses']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='courses-table']").exists()).toBe(false);
  });

  it("filters by text search across name and description", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='search-input']").setValue("Mechanics");
    expect(wrapper.find("[data-testid='course-row-3']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='course-row-1']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='course-row-2']").exists()).toBe(false);
  });

  it("filters by name", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='search-input']").setValue("Math");
    expect(wrapper.find("[data-testid='course-row-2']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='course-row-1']").exists()).toBe(false);
  });

  it("shows no-courses-filtered when filters match nothing", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='search-input']").setValue("zzznomatch");
    expect(wrapper.find("[data-testid='no-courses-filtered']").exists()).toBe(
      true,
    );
    expect(wrapper.find("[data-testid='courses-table']").exists()).toBe(false);
  });

  it("navigates to CourseView when View is clicked", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='view-course-1']").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/courses/1");
  });

  it("opens delete modal when Delete is clicked", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='delete-course-1']").trigger("click");
    expect(wrapper.find("[data-testid='delete-modal']").exists()).toBe(true);
  });

  it("delete modal is not visible before clicking Delete", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    expect(wrapper.find("[data-testid='delete-modal']").exists()).toBe(false);
  });

  it("cancelling delete modal closes it without deleting", async () => {
    const spy = vi.spyOn(coursesApi, "apiDeleteCourse");
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='delete-course-1']").trigger("click");
    await wrapper.find("[data-testid='cancel-delete-btn']").trigger("click");
    expect(wrapper.find("[data-testid='delete-modal']").exists()).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("confirming delete removes the course from the table", async () => {
    vi.spyOn(coursesApi, "apiDeleteCourse").mockResolvedValue({
      ok: true,
      data: null,
    });
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='delete-course-2']").trigger("click");
    await wrapper.find("[data-testid='confirm-delete-btn']").trigger("click");
    await flushPromises();
    expect(wrapper.find("[data-testid='delete-modal']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='course-row-2']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='course-row-1']").exists()).toBe(true);
  });

  it("opens new course modal when New Course is clicked", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='new-course-btn']").trigger("click");
    expect(wrapper.find("[data-testid='create-modal']").exists()).toBe(true);
  });

  it("create modal is not visible by default", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    expect(wrapper.find("[data-testid='create-modal']").exists()).toBe(false);
  });

  it("cancelling create modal closes it", async () => {
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='new-course-btn']").trigger("click");
    await wrapper.find("[data-testid='create-course-cancel']").trigger("click");
    expect(wrapper.find("[data-testid='create-modal']").exists()).toBe(false);
  });

  it("creating a course adds it to the table and closes the modal", async () => {
    const newCourse = { id: 99, name: "New Course", description: null };
    vi.spyOn(coursesApi, "apiCreateCourse").mockResolvedValue({
      ok: true,
      data: newCourse,
    });
    const wrapper = mount(MyCourseView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='new-course-btn']").trigger("click");
    await wrapper
      .find("[data-testid='create-course-input']")
      .setValue("New Course");
    await wrapper.find("[data-testid='create-course-form']").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[data-testid='create-modal']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='course-row-99']").exists()).toBe(true);
  });
});
