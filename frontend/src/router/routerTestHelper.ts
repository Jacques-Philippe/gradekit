import { createRouter, createMemoryHistory } from "vue-router";
import { Routes } from "@/router/routes";

export function makeTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: Routes.Home, component: { template: "<div>Home</div>" } },
      { path: Routes.Login, component: { template: "<div>Login</div>" } },
      { path: Routes.Register, component: { template: "<div>Register</div>" } },
      { path: Routes.Course, component: { template: "<div>Course</div>" } },
      {
        path: Routes.CourseStudents,
        component: { template: "<div>CourseStudents</div>" },
      },
      {
        path: Routes.Assignment,
        component: { template: "<div>Assignment</div>" },
      },
    ],
  });
}
