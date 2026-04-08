<template>
  <div class="top-bar">
    <span class="brand">{{ t("brand") }}</span>
    <div class="avatar-wrapper" ref="wrapperRef">
      <button
        class="avatar"
        @click="dropdownOpen = !dropdownOpen"
        :aria-label="t('topbar.account_menu')"
        aria-haspopup="true"
        :aria-expanded="dropdownOpen"
      >
        {{ initial }}
      </button>
      <div v-if="dropdownOpen" class="dropdown">
        <button
          class="dropdown-item"
          @click="openLanguages"
          data-testid="languages-btn"
        >
          {{ t("topbar.languages") }}
        </button>
        <button class="dropdown-item" @click="logout" data-testid="logout-btn">
          {{ t("topbar.logout") }}
        </button>
      </div>
    </div>
  </div>

  <!-- Language modal -->
  <div
    v-if="languagesOpen"
    class="modal-backdrop"
    data-testid="language-modal"
    @click.self="languagesOpen = false"
  >
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <h2 class="modal-title" id="language-modal-title">
        {{ t("topbar.language_modal_title") }}
      </h2>
      <ul class="language-list">
        <li v-for="lang in availableLocales" :key="lang.code">
          <button
            class="language-btn"
            :class="{ active: locale === lang.code }"
            @click="setLocale(lang.code)"
            :data-testid="`language-${lang.code}`"
          >
            {{ lang.label }}
          </button>
        </li>
      </ul>
      <button
        class="btn-close"
        @click="languagesOpen = false"
        data-testid="language-modal-close"
      >
        {{ t("topbar.language_modal_close") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";
import { Routes } from "@/router/routes";

const { t, locale } = useI18n();

const auth = useAuthStore();
const router = useRouter();

const dropdownOpen = ref(false);
const languagesOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

const availableLocales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

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

function openLanguages() {
  dropdownOpen.value = false;
  languagesOpen.value = true;
}

function setLocale(code: string) {
  locale.value = code;
  languagesOpen.value = false;
}

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
  min-width: 140px;
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

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
  width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a2844;
  margin: 0 0 16px;
}

.language-list {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.language-btn {
  width: 100%;
  text-align: left;
  padding: 9px 12px;
  font-size: 14px;
  background: #f5f6f8;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
}

.language-btn.active {
  background: #1a2844;
  color: #ffffff;
  border-color: #1a2844;
}

.language-btn:hover:not(.active) {
  background: #e9ebee;
}

.btn-close {
  width: 100%;
  padding: 8px;
  font-size: 13px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
}

.btn-close:hover {
  background: #f5f6f8;
}
</style>
