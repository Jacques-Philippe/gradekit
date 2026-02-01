import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { createTestRouter } from "@/router/routerTestHelper";

describe("HomeView", () => {
  let pinia: ReturnType<typeof createPinia>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    router = createTestRouter();
  });

  it("renders", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
