import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises, VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import TopBar from "@/views/TopBar.vue";
import { useAuthStore } from "@/stores/authStore";
import { Routes } from "@/router/routes";
import { makeTestRouter } from "@/router/routerTestHelper";

let wrapper: VueWrapper | null = null;

async function mountTopBar(username = "alice") {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = makeTestRouter();
  await router.push(Routes.Home);
  await router.isReady();
  wrapper = mount(TopBar, {
    global: { plugins: [pinia, router] },
    attachTo: document.body,
  });
  const store = useAuthStore();
  store.token = "fake-token";
  store.user = { id: 1, username };
  await wrapper.vm.$nextTick();
  return { wrapper, router, store };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
});

describe("TopBar", () => {
  it("renders the GradeKit brand name", async () => {
    const { wrapper } = await mountTopBar();
    expect(wrapper.find(".brand").text()).toBe("GradeKit");
  });

  it("avatar shows the uppercased first letter of the username", async () => {
    const { wrapper } = await mountTopBar("bob");
    expect(wrapper.find(".avatar").text()).toBe("B");
  });

  it("dropdown is not visible before the avatar is clicked", async () => {
    const { wrapper } = await mountTopBar();
    expect(wrapper.find(".dropdown").exists()).toBe(false);
  });

  it("clicking the avatar opens the dropdown", async () => {
    const { wrapper } = await mountTopBar();
    await wrapper.find(".avatar").trigger("click");
    expect(wrapper.find(".dropdown").exists()).toBe(true);
  });

  it("clicking Logout calls authStore.logout and navigates to Login", async () => {
    const { wrapper, store, router } = await mountTopBar();
    vi.spyOn(store, "logout");
    await wrapper.find(".avatar").trigger("click");
    await wrapper.find("[data-testid='logout-btn']").trigger("click");
    await flushPromises();
    expect(store.logout).toHaveBeenCalled();
    expect(router.currentRoute.value.path).toBe(Routes.Login);
  });

  it("clicking outside the dropdown closes it", async () => {
    const { wrapper } = await mountTopBar();
    await wrapper.find(".avatar").trigger("click");
    expect(wrapper.find(".dropdown").exists()).toBe(true);
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".dropdown").exists()).toBe(false);
  });
});
