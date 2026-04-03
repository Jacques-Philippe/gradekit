import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { makeTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";
import * as coursesApi from "@/api/courses";

const COURSES = [
  { id: 1, name: "CS101", description: null },
  { id: 2, name: "Math 201", description: null },
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
});
