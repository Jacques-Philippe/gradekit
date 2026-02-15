<template>
  <HomeView v-if="stateName === HOME_VIEW_STATE_NAME" />
  <CourseView v-else-if="stateName === COURSE_VIEW_STATE_NAME" />
  <CourseStudentsView
    v-else-if="stateName === COURSE_STUDENTS_VIEW_STATE_NAME"
  />
  <CourseAssignmentsView
    v-else-if="stateName === COURSE_ASSIGNMENTS_VIEW_STATE_NAME"
  />
  <div v-else>Unknown state: {{ stateName }}</div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { computed } from "vue";
import HomeView from "@/views/HomeView.vue";
import CourseView from "@/views/CourseView.vue";
import CourseStudentsView from "@/views/CourseStudentsView.vue";
import CourseAssignmentsView from "@/views/CourseAssignmentsView.vue";
import {
  HOME_VIEW_STATE_NAME,
  COURSE_VIEW_STATE_NAME,
  COURSE_STUDENTS_VIEW_STATE_NAME,
  COURSE_ASSIGNMENTS_VIEW_STATE_NAME,
} from "@/types/state";

const store = useAppStore();

const stateName = computed(() => store.currentState.name);
</script>
