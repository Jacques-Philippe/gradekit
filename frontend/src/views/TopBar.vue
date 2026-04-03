<template>
  <div class="top-bar">
    <span class="brand">GradeKit</span>
    <div class="right">
      <span class="username">{{ auth.user?.username }}</span>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { Routes } from "@/router/routes";

const auth = useAuthStore();
const router = useRouter();

async function logout() {
  auth.logout();
  await router.push(Routes.Login);
}
</script>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: #1a2844;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
}

.brand {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.01em;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-size: 14px;
  color: #d1d5db;
}

.logout-btn {
  background: transparent;
  border: 1px solid #ffffff40;
  color: #ffffff;
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #ffffff18;
}
</style>
