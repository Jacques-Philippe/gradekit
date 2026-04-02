import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: { public: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
    meta: { public: true },
  },
  {
    path: "/",
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
