<template>
  <div>
    <p>Welcome, {{ auth.user?.username }}</p>
    <button @click="logout">Log out</button>
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
