<template>
  <HomeView v-if="stateName === HOME_VIEW_STATE_NAME" />
  <CourseView v-else-if="stateName === COURSE_VIEW_STATE_NAME" />
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { computed } from "vue";
import HomeView from "@/views/HomeView.vue";
import CourseView from "@/views/CourseView.vue";
import { HOME_VIEW_STATE_NAME, COURSE_VIEW_STATE_NAME } from "@/types/state";

const store = useAppStore();

const stateName = computed(() => store.currentState.name);
// console.log("App state changed to:", stateName.value);
// watch(stateName, (newState) => {
//   console.log("App state changed to:", newState);
// });
</script>
