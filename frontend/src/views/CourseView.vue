<template>
  <div>
    <p v-if="!course" id="no-course-selected-warning">No course selected</p>
    <h1 v-else>{{ course.name }}</h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCourseStore } from "@/stores/courseStore";

const store = useCourseStore();
const course = computed(() => store.currentCourse);
</script>
