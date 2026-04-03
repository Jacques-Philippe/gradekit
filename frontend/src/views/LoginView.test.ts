import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import LoginView from "@/views/LoginView.vue";
import { useAuthStore } from "@/stores/authStore";
import { Routes } from "@/router/routes";
import { makeTestRouter } from "@/router/routerTestHelper";

async function mountLoginView() {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = makeTestRouter();
  await router.push(Routes.Login);
  await router.isReady();
  const wrapper = mount(LoginView, {
    global: { plugins: [pinia, router] },
  });
  return { wrapper, router, store: useAuthStore() };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("LoginView", () => {
  it("renders username and password fields and a submit button", async () => {
    const { wrapper } = await mountLoginView();
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("calls authStore.login with the entered credentials on submit", async () => {
    const { wrapper, store } = await mountLoginView();
    vi.spyOn(store, "login").mockResolvedValue(false);

    await wrapper.find('input[type="text"]').setValue("alice");
    await wrapper.find('input[type="password"]').setValue("secret");
    await wrapper.find("form").trigger("submit");

    expect(store.login).toHaveBeenCalledWith("alice", "secret");
  });

  it("navigates to HomeView when login succeeds", async () => {
    const { wrapper, store, router } = await mountLoginView();
    vi.spyOn(store, "login").mockResolvedValue(true);

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(router.currentRoute.value.path).toBe(Routes.Home);
  });

  it("displays an error message when login fails", async () => {
    const { wrapper, store } = await mountLoginView();
    vi.spyOn(store, "login").mockImplementation(async () => {
      store.error = "Invalid credentials";
      return false;
    });

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(wrapper.find("[data-testid='error']").text()).toBe(
      "Invalid credentials",
    );
  });

  it("error message is cleared when the form is submitted again", async () => {
    const { wrapper, store } = await mountLoginView();
    let callCount = 0;
    vi.spyOn(store, "login").mockImplementation(async () => {
      if (callCount++ === 0) {
        store.error = "Invalid credentials";
        return false;
      }
      store.error = "";
      return false;
    });

    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[data-testid='error']").text()).toBe(
      "Invalid credentials",
    );

    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[data-testid='error']").exists()).toBe(false);
  });

  it("submit button is disabled while the request is in flight", async () => {
    const { wrapper, store } = await mountLoginView();
    vi.spyOn(store, "login").mockImplementation(async () => {
      store.loading = true;
      await new Promise((r) => setTimeout(r, 50));
      store.loading = false;
      return true;
    });

    wrapper.find("form").trigger("submit");
    await flushPromises();
    // During in-flight: loading was true
    store.loading = true;
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("button[type='submit']").attributes("disabled"),
    ).toBeDefined();

    store.loading = false;
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("button[type='submit']").attributes("disabled"),
    ).toBeUndefined();
  });
});
