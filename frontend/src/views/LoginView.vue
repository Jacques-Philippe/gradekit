<template>
  <div class="auth-page">
    <div class="auth-card">
      <p class="brand">GradeKit</p>
      <h1>Log in</h1>
      <form @submit.prevent="submit">
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
          autocomplete="current-password"
        />
        <p v-if="auth.error" data-testid="error" class="error">
          {{ auth.error }}
        </p>
        <button type="submit" :disabled="auth.loading">
          {{ auth.loading ? "Logging in…" : "Log in" }}
        </button>
        <p class="switch-link">
          Don't have an account?
          <router-link :to="Routes.Register">Register</router-link>
        </p>
      </form>
    </div>
  </div>
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
  const ok = await auth.login(username.value, password.value);
  if (ok) router.push(Routes.Home);
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f6f8;
}

.auth-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 40px 36px;
  width: 100%;
  max-width: 380px;
}

.brand {
  font-size: 13px;
  font-weight: 600;
  color: #1a2844;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 8px;
}

h1 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}

input:focus {
  border-color: #1a2844;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #1a2844;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  margin-top: 4px;
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  font-size: 13px;
  color: #dc2626;
  margin: 0;
}

.switch-link {
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  margin: 4px 0 0;
}

.switch-link a {
  color: #1a2844;
  font-weight: 600;
  text-decoration: none;
}

.switch-link a:hover {
  text-decoration: underline;
}
</style>
