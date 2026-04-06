import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import CourseView from "@/views/CourseView.vue";
import { makeTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";
import * as coursesApi from "@/api/courses";
import * as studentsApi from "@/api/students";

const COURSE = { id: 1, name: "CS101", description: null, due_date: null };
const STUDENTS = [
  { id: 10, full_name: "Alice Smith" },
  { id: 11, full_name: "Bob Jones" },
];

describe("CourseView", () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(async () => {
    pinia = setupTestPinia();
    router = makeTestRouter();
    await router.push("/courses/1");
    await router.isReady();
    vi.spyOn(coursesApi, "apiGetCourse").mockResolvedValue({
      ok: true,
      data: COURSE,
    });
    vi.spyOn(studentsApi, "apiGetStudents").mockResolvedValue({
      ok: true,
      data: STUDENTS,
    });
  });

  it("renders the course name", async () => {
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='course-name']").text()).toBe("CS101");
  });

  it("renders enrolled students", async () => {
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='student-list']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='student-10']").text()).toBe(
      "Alice Smith",
    );
    expect(wrapper.find("[data-testid='student-11']").text()).toBe("Bob Jones");
  });

  it("shows empty state when no students are enrolled", async () => {
    vi.spyOn(studentsApi, "apiGetStudents").mockResolvedValue({
      ok: true,
      data: [],
    });
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='students-empty']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='student-list']").exists()).toBe(false);
  });

  it("shows the Add Student button", async () => {
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='add-student-btn']").exists()).toBe(true);
  });

  it("shows the Import CSV button", async () => {
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='import-csv-btn']").exists()).toBe(true);
  });

  it("navigates to CourseStudentsView when Add Student is clicked", async () => {
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    await wrapper.find("[data-testid='add-student-btn']").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/courses/1/students");
  });

  it("navigates to CourseStudentsView with import tab when Import CSV is clicked", async () => {
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    await wrapper.find("[data-testid='import-csv-btn']").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/courses/1/students");
    expect(router.currentRoute.value.query.tab).toBe("import");
  });

  it("shows assignments placeholder section", async () => {
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(
      wrapper.find("[data-testid='assignments-placeholder']").exists(),
    ).toBe(true);
  });

  it("shows error state when course fetch fails", async () => {
    vi.spyOn(coursesApi, "apiGetCourse").mockResolvedValue({
      ok: false,
      error: "Not found",
    });
    const wrapper = mount(CourseView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='course-error']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='course-error']").text()).toContain(
      "Not found",
    );
  });
});
