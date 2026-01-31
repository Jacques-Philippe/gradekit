import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import HomeView from "@/views/HomeView.vue";

describe("HomeView", () => {
  it("renders", () => {
    const wrapper = mount(HomeView);
    expect(wrapper.exists()).toBe(true);
  });
});
