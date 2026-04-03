import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "/gradekit/",
    plugins: [vue(), svgLoader()],
    test: {
      environment: "jsdom",
      globals: true,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL ?? "http://localhost:8000",
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
