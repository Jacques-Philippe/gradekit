import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CourseView from "@/views/CourseView.vue";
import AppWrapper from "@/views/AppWrapper.vue";

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: HomeView,
//   },
//   { path: "/course/:id", name: "course", component: CourseView, props: true },
// ];

const routes = [
  {
    path: "/",
    name: "Home",
    component: AppWrapper,
  },
  // { path: "/course/:id", name: "course", component: CourseView, props: true },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
