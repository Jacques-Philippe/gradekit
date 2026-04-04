<template>
  <nav class="sidebar" data-testid="sidebar">
    <ul class="sidebar-nav">
      <li>
        <router-link
          :to="Routes.Home"
          class="sidebar-item"
          :class="{ 'sidebar-item-active': route.path === Routes.Home }"
          data-testid="sidebar-dashboard"
        >
          <svg
            class="sidebar-icon"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="6" height="6" rx="1" />
            <rect x="9" y="1" width="6" height="6" rx="1" />
            <rect x="1" y="9" width="6" height="6" rx="1" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
          </svg>
          <span>{{ t("sidebar.dashboard") }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="Routes.Home"
          class="sidebar-item"
          data-testid="sidebar-my-courses"
        >
          <svg
            class="sidebar-icon"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M1 2.5A1.5 1.5 0 012.5 1h8A1.5 1.5 0 0112 2.5V12h1.5a.5.5 0 010 1h-10a1.5 1.5 0 01-1.5-1.5V2.5zm2 0V12h7V2.5a.5.5 0 00-.5-.5h-6a.5.5 0 00-.5.5z"
            />
          </svg>
          <span>{{ t("sidebar.my_courses") }}</span>
        </router-link>
      </li>
      <li>
        <router-link
          :to="Routes.Settings"
          class="sidebar-item"
          :class="{ 'sidebar-item-active': route.path === Routes.Settings }"
          data-testid="sidebar-settings"
        >
          <svg
            class="sidebar-icon"
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
          <span>{{ t("sidebar.settings") }}</span>
        </router-link>
      </li>
    </ul>
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
.sidebar {
  width: 200px;
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;
  background: #ffffff;
  min-height: calc(100vh - 52px);
  padding: 12px 0;
}

.sidebar-nav {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  border-radius: 0;
  transition:
    background 0.1s,
    color 0.1s;
}

.sidebar-item:hover {
  background: #f5f6f8;
  color: #1a2844;
}

.sidebar-item-active {
  color: #1a2844;
  background: #f0f2f7;
}

.sidebar-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Hidden on mobile — BottomBar takes over */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
