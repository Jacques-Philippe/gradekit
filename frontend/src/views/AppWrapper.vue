<template>
  <template v-if="auth.token !== null">
    <TopBar />
    <div class="app-layout">
      <Sidebar />
      <main class="app-main">
        <router-view />
      </main>
    </div>
    <BottomBar />
  </template>
  <router-view v-else />
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import TopBar from "@/views/TopBar.vue";
import Sidebar from "@/views/Sidebar.vue";
import BottomBar from "@/views/BottomBar.vue";

const auth = useAuthStore();
</script>

<style scoped>
.app-layout {
  display: flex;
  padding-top: 52px; /* TopBar height */
  min-height: 100vh;
}

.app-main {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .app-main {
    padding-bottom: 56px; /* BottomBar height */
  }
}
</style>
