<template>
  <HomeView v-if="stateName === 'HomeView'" />
  <!-- <SettingsView v-else-if="stateName === 'SettingsView'" /> -->
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { computed } from "vue";
import HomeView from "@/views/HomeView.vue";

const store = useAppStore();

const stateName = computed(() => store.currentState.name);
console.log("Current state:", stateName.value);
</script>
