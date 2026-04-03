import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import RegisterView from "@/views/RegisterView.vue";
import { useAuthStore } from "@/stores/authStore";
import { Routes } from "@/router/routes";
import { makeTestRouter } from "@/router/routerTestHelper";

async function mountRegisterView() {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = makeTestRouter();
  await router.push(Routes.Register);
  await router.isReady();
  const wrapper = mount(RegisterView, {
    global: { plugins: [pinia, router] },
  });
  return { wrapper, router, store: useAuthStore() };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("RegisterView", () => {
  it("renders username and password fields and a submit button", async () => {
    const { wrapper } = await mountRegisterView();
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it("calls authStore.register with the entered credentials on submit", async () => {
    const { wrapper, store } = await mountRegisterView();
    vi.spyOn(store, "register").mockResolvedValue(false);

    await wrapper.find('input[type="text"]').setValue("alice");
    await wrapper.find('input[type="password"]').setValue("secret");
    await wrapper.find("form").trigger("submit");

    expect(store.register).toHaveBeenCalledWith("alice", "secret");
  });

  it("navigates to HomeView when registration succeeds", async () => {
    const { wrapper, store, router } = await mountRegisterView();
    vi.spyOn(store, "register").mockResolvedValue(true);

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(router.currentRoute.value.path).toBe(Routes.Home);
  });

  it("displays an error message when registration fails", async () => {
    const { wrapper, store } = await mountRegisterView();
    vi.spyOn(store, "register").mockImplementation(async () => {
      store.error = "The username is already taken";
      return false;
    });

    await wrapper.find("form").trigger("submit");
    await flushPromises();

    expect(wrapper.find("[data-testid='error']").text()).toBe(
      "The username is already taken",
    );
  });

  it("error message is cleared when the form is submitted again", async () => {
    const { wrapper, store } = await mountRegisterView();
    let callCount = 0;
    vi.spyOn(store, "register").mockImplementation(async () => {
      if (callCount++ === 0) {
        store.error = "The username is already taken";
        return false;
      }
      store.error = "";
      return false;
    });

    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[data-testid='error']").text()).toBe(
      "The username is already taken",
    );

    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[data-testid='error']").exists()).toBe(false);
  });

  it("submit button is disabled while the request is in flight", async () => {
    const { wrapper, store } = await mountRegisterView();
    let resolve!: (value: boolean) => void;
    const deferred = new Promise<boolean>((r) => (resolve = r));
    vi.spyOn(store, "register").mockImplementation(() => {
      store.loading = true;
      return deferred.finally(() => {
        store.loading = false;
      });
    });

    wrapper.find("form").trigger("submit");
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("button[type='submit']").attributes("disabled"),
    ).toBeDefined();

    resolve(true);
    await flushPromises();
    expect(
      wrapper.find("button[type='submit']").attributes("disabled"),
    ).toBeUndefined();
  });
});
