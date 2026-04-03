import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { Routes } from "@/router/routes";

const routes = [
  {
    path: Routes.Login,
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: { public: true },
  },
  {
    path: Routes.Register,
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
    meta: { public: true },
  },
  {
    path: Routes.Home,
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!auth.token) {
    await auth.restoreSession();
  }

  const isPublic = to.meta.public === true;
  const isAuthenticated = auth.token !== null;

  if (!isPublic && !isAuthenticated) {
    return { name: "Login" };
  }

  if (isPublic && isAuthenticated) {
    return { name: "Home" };
  }
});
