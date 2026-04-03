<template>
  <form @submit.prevent="submit">
    <h1>Create account</h1>
    <input
      v-model="username"
      type="text"
      placeholder="Username"
      autocomplete="username"
    />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      autocomplete="new-password"
    />
    <p v-if="auth.error" data-testid="error">{{ auth.error }}</p>
    <button type="submit" :disabled="auth.loading">Register</button>
    <p>
      Already have an account?
      <router-link :to="Routes.Login">Log in</router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { Routes } from "@/router/routes";

const auth = useAuthStore();
const router = useRouter();
const username = ref("");
const password = ref("");

async function submit() {
  const ok = await auth.register(username.value, password.value);
  if (ok) router.push(Routes.Home);
}
</script>
