import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import CourseStudentsView from "@/views/CourseStudentsView.vue";
import { makeTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";
import * as studentsApi from "@/api/students";

const STUDENTS = [
  { id: 10, full_name: "Alice Smith" },
  { id: 11, full_name: "Bob Jones" },
];

describe("CourseStudentsView", () => {
  let pinia: Pinia;
  let router: Router;

  beforeEach(async () => {
    pinia = setupTestPinia();
    router = makeTestRouter();
    await router.push("/courses/1/students");
    await router.isReady();
    vi.spyOn(studentsApi, "apiGetStudents").mockResolvedValue({
      ok: true,
      data: STUDENTS,
    });
  });

  it("renders the enrolled student list", async () => {
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    expect(wrapper.find("[data-testid='student-list']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='student-row-10']").text()).toContain(
      "Alice Smith",
    );
    expect(wrapper.find("[data-testid='student-row-11']").text()).toContain(
      "Bob Jones",
    );
  });

  it("shows empty state when no students enrolled", async () => {
    vi.spyOn(studentsApi, "apiGetStudents").mockResolvedValue({
      ok: true,
      data: [],
    });
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    expect(wrapper.find("[data-testid='students-empty']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='student-list']").exists()).toBe(false);
  });

  it("each row has a remove button", async () => {
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    expect(wrapper.find("[data-testid='remove-student-10']").exists()).toBe(
      true,
    );
  });

  it("removes a student when remove button is clicked", async () => {
    vi.spyOn(studentsApi, "apiDeleteStudent").mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='remove-student-10']").trigger("click");
    await flushPromises();
    expect(wrapper.find("[data-testid='student-row-10']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='student-row-11']").exists()).toBe(true);
  });

  it("defaults to manual tab", async () => {
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    expect(wrapper.find("[data-testid='panel-manual']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='panel-import']").exists()).toBe(false);
  });

  it("switches to import tab when ?tab=import is in the URL", async () => {
    await router.push("/courses/1/students?tab=import");
    await router.isReady();
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    expect(wrapper.find("[data-testid='panel-import']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='panel-manual']").exists()).toBe(false);
  });

  it("switches tabs when tab buttons are clicked", async () => {
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await wrapper.find("[data-testid='tab-import']").trigger("click");
    expect(wrapper.find("[data-testid='panel-import']").exists()).toBe(true);
    await wrapper.find("[data-testid='tab-manual']").trigger("click");
    expect(wrapper.find("[data-testid='panel-manual']").exists()).toBe(true);
  });

  it("adds a student manually and appends to list", async () => {
    const newStudent = { id: 99, full_name: "Carol White" };
    vi.spyOn(studentsApi, "apiAddStudent").mockResolvedValue({
      ok: true,
      data: newStudent,
    });
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper
      .find("[data-testid='manual-name-input']")
      .setValue("Carol White");
    await wrapper.find("[data-testid='add-student-form']").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[data-testid='student-row-99']").exists()).toBe(true);
    expect(
      (
        wrapper.find("[data-testid='manual-name-input']")
          .element as HTMLInputElement
      ).value,
    ).toBe("");
  });

  it("shows error when adding a student fails", async () => {
    vi.spyOn(studentsApi, "apiAddStudent").mockResolvedValue({
      ok: false,
      error: "Something went wrong",
    });
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await wrapper
      .find("[data-testid='manual-name-input']")
      .setValue("Bad Name");
    await wrapper.find("[data-testid='add-student-form']").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[data-testid='add-student-error']").text()).toContain(
      "Something went wrong",
    );
  });

  it("shows a preview after selecting a valid CSV file", async () => {
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await wrapper.find("[data-testid='tab-import']").trigger("click");

    const csvContent = "full_name\nDave Brown\nEve Green";
    const file = new File([csvContent], "students.csv", { type: "text/csv" });
    const input = wrapper.find("[data-testid='csv-file-input']")
      .element as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file] });
    await wrapper.find("[data-testid='csv-file-input']").trigger("change");

    // FileReader is async — give it a tick
    await new Promise((r) => setTimeout(r, 10));
    await flushPromises();

    expect(wrapper.find("[data-testid='preview-list']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='preview-row-0']").text()).toBe(
      "Dave Brown",
    );
    expect(wrapper.find("[data-testid='preview-row-1']").text()).toBe(
      "Eve Green",
    );
  });

  it("shows parse error for CSV missing full_name column", async () => {
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await wrapper.find("[data-testid='tab-import']").trigger("click");

    const csvContent = "name\nDave Brown";
    const file = new File([csvContent], "bad.csv", { type: "text/csv" });
    const input = wrapper.find("[data-testid='csv-file-input']")
      .element as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file] });
    await wrapper.find("[data-testid='csv-file-input']").trigger("change");
    await new Promise((r) => setTimeout(r, 10));
    await flushPromises();

    expect(wrapper.find("[data-testid='parse-error']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='preview-list']").exists()).toBe(false);
  });

  it("cancels import and returns to file input", async () => {
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await wrapper.find("[data-testid='tab-import']").trigger("click");

    const csvContent = "full_name\nDave Brown";
    const file = new File([csvContent], "s.csv", { type: "text/csv" });
    const input = wrapper.find("[data-testid='csv-file-input']")
      .element as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file] });
    await wrapper.find("[data-testid='csv-file-input']").trigger("change");
    await new Promise((r) => setTimeout(r, 10));
    await flushPromises();

    await wrapper.find("[data-testid='cancel-import-btn']").trigger("click");
    expect(wrapper.find("[data-testid='preview-list']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='csv-file-input']").exists()).toBe(true);
  });

  it("confirms import, updates student list, shows result", async () => {
    const importResult = {
      created: [{ id: 20, full_name: "Dave Brown" }],
      errors: [],
    };
    vi.spyOn(studentsApi, "apiImportStudents").mockResolvedValue({
      ok: true,
      data: importResult,
    });
    const wrapper = mount(CourseStudentsView, {
      global: { plugins: [pinia, router] },
    });
    await flushPromises();
    await wrapper.find("[data-testid='tab-import']").trigger("click");

    const csvContent = "full_name\nDave Brown";
    const file = new File([csvContent], "s.csv", { type: "text/csv" });
    const input = wrapper.find("[data-testid='csv-file-input']")
      .element as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file] });
    await wrapper.find("[data-testid='csv-file-input']").trigger("change");
    await new Promise((r) => setTimeout(r, 10));
    await flushPromises();

    await wrapper.find("[data-testid='confirm-import-btn']").trigger("click");
    await flushPromises();

    expect(wrapper.find("[data-testid='import-result']").exists()).toBe(true);
    expect(wrapper.find("[data-testid='preview-list']").exists()).toBe(false);
    expect(wrapper.find("[data-testid='student-row-20']").exists()).toBe(true);
  });
});
