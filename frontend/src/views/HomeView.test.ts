import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia } from "pinia";
import { createRouter } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { createTestRouter } from "@/router/routerTestHelper";
import { setupTestPinia } from "@/utils/piniaTestHelper";

describe("HomeView", () => {
  let pinia: ReturnType<typeof createPinia>;
  let router: ReturnType<typeof createRouter>;

  beforeEach(async () => {
    pinia = setupTestPinia();
    router = createTestRouter();
    await router.push("/");
    await router.isReady();
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
