<template>
  <div>
    <p>Welcome, {{ auth.user?.username }}</p>
    <button
      @click="
        auth.logout();
        $router.push('/login');
      "
    >
      Log out
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
const auth = useAuthStore();
</script>
