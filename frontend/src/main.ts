import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import App from "./App.vue";

fetch("/api/health")
  .then((res) => res.json())
  .then((data) => console.log("[health]", data))
  .catch((err) => console.error("[health] backend unreachable", err));

createApp(App).use(createPinia()).use(router).mount("#app");
