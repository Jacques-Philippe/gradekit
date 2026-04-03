<template>
  <div class="top-bar">
    <span class="brand">GradeKit</span>
    <div class="avatar-wrapper" ref="wrapperRef">
      <button class="avatar" @click="dropdownOpen = !dropdownOpen">
        {{ initial }}
      </button>
      <div v-if="dropdownOpen" class="dropdown">
        <button class="dropdown-item" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { Routes } from "@/router/routes";

const auth = useAuthStore();
const router = useRouter();

const dropdownOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

const initial = computed(() =>
  (auth.user?.username ?? "?").charAt(0).toUpperCase(),
);

function onDocumentClick(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", onDocumentClick));
onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick));

async function logout() {
  dropdownOpen.value = false;
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

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2e4a7a;
  border: 2px solid #ffffff40;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar:hover {
  background: #3a5a94;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f6f8;
}
</style>
