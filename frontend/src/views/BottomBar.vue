<template>
  <nav class="bottom-bar" data-testid="bottom-bar">
    <router-link
      :to="Routes.Home"
      class="bottom-bar-item"
      :class="{ 'bottom-bar-item-active': route.path === Routes.Home }"
      data-testid="bottom-bar-dashboard"
    >
      <svg
        class="bottom-bar-icon"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
      <span class="bottom-bar-label">{{ t("sidebar.dashboard") }}</span>
    </router-link>
    <router-link
      :to="Routes.MyCourses"
      class="bottom-bar-item"
      :class="{ 'bottom-bar-item-active': route.path === Routes.MyCourses }"
      data-testid="bottom-bar-my-courses"
    >
      <svg
        class="bottom-bar-icon"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M1 2.5A1.5 1.5 0 012.5 1h8A1.5 1.5 0 0112 2.5V12h1.5a.5.5 0 010 1h-10a1.5 1.5 0 01-1.5-1.5V2.5zm2 0V12h7V2.5a.5.5 0 00-.5-.5h-6a.5.5 0 00-.5.5z"
        />
      </svg>
      <span class="bottom-bar-label">{{ t("sidebar.my_courses") }}</span>
    </router-link>
    <router-link
      :to="Routes.Settings"
      class="bottom-bar-item"
      :class="{ 'bottom-bar-item-active': route.path === Routes.Settings }"
      data-testid="bottom-bar-settings"
    >
      <svg
        class="bottom-bar-icon"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M8 4.754a3.246 3.246 0 100 6.492 3.246 3.246 0 000-6.492zM5.754 8a2.246 2.246 0 114.492 0 2.246 2.246 0 01-4.492 0z"
        />
        <path
          d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 01-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 01-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 01.52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 011.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 011.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 01.52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 01-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 01-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 002.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 001.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 00-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 00-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 00-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 001.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 003.06 4.576l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 002.692-1.115l.094-.319z"
        />
      </svg>
      <span class="bottom-bar-label">{{ t("sidebar.settings") }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { Routes } from "@/router/routes";

const { t } = useI18n();
const route = useRoute();
</script>

<style scoped>
/* Shown only on mobile */
.bottom-bar {
  display: none;
}

@media (max-width: 768px) {
  .bottom-bar {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #ffffff;
    border-top: 1px solid #e5e7eb;
    z-index: 90;
  }
}

.bottom-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: #9ca3af;
  font-size: 11px;
  font-weight: 500;
  transition: color 0.1s;
}

.bottom-bar-item:hover {
  color: #1a2844;
}

.bottom-bar-item-active {
  color: #1a2844;
}

.bottom-bar-icon {
  width: 20px;
  height: 20px;
}

.bottom-bar-label {
  line-height: 1;
}
</style>
