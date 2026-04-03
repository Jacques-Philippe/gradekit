import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { makeTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";
import * as coursesApi from "@/api/courses";
import * as activityApi from "@/api/activity";
import * as deadlinesApi from "@/api/deadlines";

const COURSES = [
  { id: 1, name: "CS101", description: null },
  { id: 2, name: "Math 201", description: null },
];

const ACTIVITY = [
  {
    id: 1,
    event_type: "STUDENT_ADDED",
    payload: JSON.stringify({ course_id: 2 }),
    created_at: "2026-04-03T10:00:00Z",
  },
  {
    id: 2,
    event_type: "COURSE_CREATED",
    payload: JSON.stringify({ course_id: 1 }),
    created_at: "2026-04-02T10:00:00Z",
  },
];

const DEADLINES = [
  {
    assignment_id: 1,
    assignment_title: "Homework 1",
    course_id: 1,
    course_name: "CS101",
    due_date: "2099-12-31T23:59:00Z",
  },
  {
    assignment_id: 2,
    assignment_title: "Midterm",
    course_id: 2,
    course_name: "Math 201",
    due_date: "2099-11-01T10:00:00Z",
  },
];

describe("HomeView", () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(async () => {
    pinia = setupTestPinia();
    router = makeTestRouter();
    await router.push("/");
    await router.isReady();
    vi.spyOn(coursesApi, "apiGetCourses").mockResolvedValue({
      ok: true,
      data: COURSES,
    });
    vi.spyOn(activityApi, "apiGetActivity").mockResolvedValue({
      ok: true,
      data: ACTIVITY,
    });
    vi.spyOn(deadlinesApi, "apiGetDeadlines").mockResolvedValue({
      ok: true,
      data: DEADLINES,
    });
  });

  it("renders", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    expect(wrapper.exists()).toBe(true);
  });

  it("shows the search input", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    expect(wrapper.find("[data-testid='search-input']").exists()).toBe(true);
  });

  it("does not show results before typing", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    expect(wrapper.find("[data-testid='search-results']").exists()).toBe(false);
  });

  it("shows matching courses when the user types", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    const input = wrapper.find("[data-testid='search-input']");
    await input.trigger("focus");
    await input.setValue("CS");
    expect(wrapper.find("[data-testid='search-results']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='result-course-1']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='result-course-2']").exists()).toBe(
      false,
    );
  });

  it("hides results when the input is cleared", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    const input = wrapper.find("[data-testid='search-input']");
    await input.trigger("focus");
    await input.setValue("CS");
    await input.setValue("");
    expect(wrapper.find("[data-testid='search-results']").exists()).toBe(false);
  });

  it("hides results when the input loses focus", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    const input = wrapper.find("[data-testid='search-input']");
    await input.trigger("focus");
    await input.setValue("CS");
    await input.trigger("blur");
    expect(wrapper.find("[data-testid='search-results']").exists()).toBe(false);
  });

  it("navigates to the course route when a result is clicked", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    const input = wrapper.find("[data-testid='search-input']");
    await input.trigger("focus");
    await input.setValue("CS");
    await wrapper.find("[data-testid='result-course-1']").trigger("mousedown");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/courses/1");
  });

  it("shows recent courses derived from activity feed", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    // ACTIVITY has course_id 2 most recent, then course_id 1
    expect(wrapper.find("[data-testid='recent-course-2']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='recent-course-1']").exists()).toBe(true);
    const cards = wrapper.findAll("[data-testid^='recent-course-']");
    expect(cards[0].attributes("data-testid")).toBe("recent-course-2");
    expect(cards[1].attributes("data-testid")).toBe("recent-course-1");
  });

  it("shows empty state when there is no activity", async () => {
    vi.spyOn(activityApi, "apiGetActivity").mockResolvedValue({
      ok: true,
      data: [],
    });
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid^='recent-course-']").exists()).toBe(
      false,
    );
    expect(wrapper.text()).toContain("No recent activity yet.");
  });

  it("renders activity feed events", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='activity-feed']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='activity-event-1']").exists()).toBe(
      true,
    );
    expect(wrapper.find("[data-testid='activity-event-2']").exists()).toBe(
      true,
    );
  });

  it("shows formatted event messages", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    const feed = wrapper.find("[data-testid='activity-feed']");
    expect(feed.text()).toContain("Added");
    expect(feed.text()).toContain("Created course");
  });

  it("shows empty state when activity is empty", async () => {
    vi.spyOn(activityApi, "apiGetActivity").mockResolvedValue({
      ok: true,
      data: [],
    });
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='activity-empty']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='activity-feed']").exists()).toBe(false);
  });

  it("shows create course button", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    expect(wrapper.find("[data-testid='open-create-course']").exists()).toBe(
      true,
    );
  });

  it("shows create form when button is clicked", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await wrapper.find("[data-testid='open-create-course']").trigger("click");
    expect(wrapper.find("[data-testid='create-course-form']").exists()).toBe(
      true,
    );
  });

  it("hides form on cancel", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await wrapper.find("[data-testid='open-create-course']").trigger("click");
    await wrapper.find("[data-testid='create-course-cancel']").trigger("click");
    expect(wrapper.find("[data-testid='create-course-form']").exists()).toBe(
      false,
    );
  });

  it("creates a course and updates the recent list", async () => {
    const newCourse = { id: 3, name: "New Course", description: null };
    vi.spyOn(coursesApi, "apiCreateCourse").mockResolvedValue({
      ok: true,
      data: newCourse,
    });
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    await wrapper.find("[data-testid='open-create-course']").trigger("click");
    await wrapper
      .find("[data-testid='create-course-input']")
      .setValue("New Course");
    await wrapper.find("[data-testid='create-course-form']").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[data-testid='create-course-form']").exists()).toBe(
      false,
    );
    expect(wrapper.find("[data-testid='recent-course-3']").exists()).toBe(true);
  });

  it("navigates to course when a recent course card is clicked", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    await wrapper.find("[data-testid='recent-course-2']").trigger("click");
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/courses/2");
  });

  it("renders deadline items", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='deadlines-list']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='deadline-1']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='deadline-2']").exists()).toBe(true);
  });

  it("shows assignment title and course name in each deadline row", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    const item = wrapper.find("[data-testid='deadline-1']");
    expect(item.text()).toContain("Homework 1");
    expect(item.text()).toContain("CS101");
  });

  it("shows empty state when there are no deadlines", async () => {
    vi.spyOn(deadlinesApi, "apiGetDeadlines").mockResolvedValue({
      ok: true,
      data: [],
    });
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    expect(wrapper.find("[data-testid='deadlines-empty']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='deadlines-list']").exists()).toBe(false);
  });

  it("marks deadlines within 24 hours as urgent", async () => {
    const soonIso = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    vi.spyOn(deadlinesApi, "apiGetDeadlines").mockResolvedValue({
      ok: true,
      data: [
        {
          assignment_id: 99,
          assignment_title: "Final",
          course_id: 1,
          course_name: "CS101",
          due_date: soonIso,
        },
      ],
    });
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    const item = wrapper.find("[data-testid='deadline-99']");
    expect(item.classes()).toContain("deadline-urgent");
  });

  it("does not mark far-future deadlines as urgent", async () => {
    const wrapper = mount(HomeView, { global: { plugins: [pinia, router] } });
    await flushPromises();
    const item = wrapper.find("[data-testid='deadline-1']");
    expect(item.classes()).not.toContain("deadline-urgent");
  });
});
