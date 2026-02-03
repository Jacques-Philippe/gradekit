import { createPinia, setActivePinia } from "pinia";

/**
 * Helper to set up Pinia store for tests
 */
export function setupTestPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}
