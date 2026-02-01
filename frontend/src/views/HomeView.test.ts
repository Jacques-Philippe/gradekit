import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: HomeView }],
});

describe("HomeView", () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    router.push("/");
    await router.isReady();
  });

  it("renders", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });
});
