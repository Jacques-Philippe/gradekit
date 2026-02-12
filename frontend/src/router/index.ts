import { createRouter, createWebHistory } from "vue-router";
import AppWrapper from "@/views/AppWrapper.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: AppWrapper,
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
