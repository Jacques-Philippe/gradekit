import { createRouter, createMemoryHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { defineComponent } from "vue";

// Dummy component for testing routes
const DummyComponent = defineComponent({ template: "<div>Dummy</div>" });

const defaultRoutes: RouteRecordRaw[] = [
  {
    path: "/course/:id",
    name: "course",
    component: DummyComponent,
  },
  {
    path: "/",
    name: "Home",
    component: DummyComponent,
  },
];

/**
 * Helper to create a test router for mounting components
 */
export function createTestRouter(routes: RouteRecordRaw[] = defaultRoutes) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  });
  return router;
}
