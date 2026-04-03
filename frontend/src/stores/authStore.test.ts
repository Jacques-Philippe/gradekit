import { beforeEach, describe, expect, it, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import * as authApi from "@/api/auth";

vi.mock("@/api/auth");

const mockUser = { id: 1, username: "alice" };

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.resetAllMocks();
});

describe("login", () => {
  it("sets token and user on success", async () => {
    vi.mocked(authApi.apiLogin).mockResolvedValue({
      ok: true,
      data: { token: "tok" },
    });
    vi.mocked(authApi.apiMe).mockResolvedValue({ ok: true, data: mockUser });

    const store = useAuthStore();
    const result = await store.login("alice", "secret");

    expect(result).toBe(true);
    expect(store.token).toBe("tok");
    expect(store.user).toEqual(mockUser);
    expect(store.error).toBe("");
  });

  it("sets error and leaves token null on failure", async () => {
    vi.mocked(authApi.apiLogin).mockResolvedValue({
      ok: false,
      error: "Username does not exist",
    });

    const store = useAuthStore();
    const result = await store.login("ghost", "secret");

    expect(result).toBe(false);
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.error).toBe("Username does not exist");
  });

  it("does not persist token when /auth/me fails after login", async () => {
    vi.mocked(authApi.apiLogin).mockResolvedValue({
      ok: true,
      data: { token: "tok" },
    });
    vi.mocked(authApi.apiMe).mockResolvedValue({
      ok: false,
      error: "Invalid or expired token",
    });

    const store = useAuthStore();
    const result = await store.login("alice", "secret");

    expect(result).toBe(false);
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});

describe("register", () => {
  it("sets token and user on success", async () => {
    vi.mocked(authApi.apiRegister).mockResolvedValue({
      ok: true,
      data: { token: "tok" },
    });
    vi.mocked(authApi.apiMe).mockResolvedValue({ ok: true, data: mockUser });

    const store = useAuthStore();
    const result = await store.register("alice", "secret");

    expect(result).toBe(true);
    expect(store.token).toBe("tok");
    expect(store.user).toEqual(mockUser);
    expect(store.error).toBe("");
  });

  it("sets error and leaves token null on failure", async () => {
    vi.mocked(authApi.apiRegister).mockResolvedValue({
      ok: false,
      error: "The username is already taken",
    });

    const store = useAuthStore();
    const result = await store.register("alice", "secret");

    expect(result).toBe(false);
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.error).toBe("The username is already taken");
  });

  it("does not persist token when /auth/me fails after register", async () => {
    vi.mocked(authApi.apiRegister).mockResolvedValue({
      ok: true,
      data: { token: "tok" },
    });
    vi.mocked(authApi.apiMe).mockResolvedValue({
      ok: false,
      error: "Invalid or expired token",
    });

    const store = useAuthStore();
    const result = await store.register("alice", "secret");

    expect(result).toBe(false);
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});

describe("logout", () => {
  it("clears token, user, and removes token from localStorage", async () => {
    vi.mocked(authApi.apiLogin).mockResolvedValue({
      ok: true,
      data: { token: "tok" },
    });
    vi.mocked(authApi.apiMe).mockResolvedValue({ ok: true, data: mockUser });

    const store = useAuthStore();
    await store.login("alice", "secret");
    expect(localStorage.getItem("auth_token")).toBe("tok");

    store.logout();

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});

describe("restoreSession", () => {
  it("sets user when a valid token exists in localStorage", async () => {
    localStorage.setItem("auth_token", "tok");
    vi.mocked(authApi.apiMe).mockResolvedValue({ ok: true, data: mockUser });

    const store = useAuthStore();
    await store.restoreSession();

    expect(store.token).toBe("tok");
    expect(store.user).toEqual(mockUser);
  });

  it("clears token and user when the stored token is invalid", async () => {
    localStorage.setItem("auth_token", "bad-tok");
    vi.mocked(authApi.apiMe).mockResolvedValue({
      ok: false,
      error: "Invalid or expired token",
    });

    const store = useAuthStore();
    await store.restoreSession();

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});
