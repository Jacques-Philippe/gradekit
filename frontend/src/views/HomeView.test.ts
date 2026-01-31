import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import HomeView from "@/views/HomeView.vue";

describe("HomeView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.exists()).toBe(true);
  });
});
