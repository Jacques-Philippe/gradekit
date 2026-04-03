import { createRouter, createWebHashHistory } from "vue-router";
import { Routes } from "@/router/routes";

export function makeTestRouter() {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: Routes.Home, component: { template: "<div>Home</div>" } },
      { path: Routes.Login, component: { template: "<div>Login</div>" } },
      { path: Routes.Register, component: { template: "<div>Register</div>" } },
    ],
  });
}
