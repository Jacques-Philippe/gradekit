<template>
  <div>
    <p>Welcome, {{ auth.user?.username }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();
</script>
