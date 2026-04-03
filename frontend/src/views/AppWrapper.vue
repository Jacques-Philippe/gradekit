<template>
  <TopBar v-if="auth.token !== null" />
  <div :class="{ 'with-top-bar': auth.token !== null }">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import TopBar from "@/views/TopBar.vue";

const auth = useAuthStore();
</script>

<style scoped>
.with-top-bar {
  padding-top: 52px;
}
</style>
