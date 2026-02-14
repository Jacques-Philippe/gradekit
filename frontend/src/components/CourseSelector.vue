<template>
  <section>
    <h2>Select a course</h2>

    <p v-if="loading" id="courses-loading-indicator">Loading courses…</p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <div v-else class="course-list">
      <button
        v-for="course in courses"
        :key="course.id"
        :data-test="`course-${course.id}`"
        @click="select(course.id)"
        type="button"
      >
        {{ course.name }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import {
  ButtonPressedStateTransition,
  COURSE_BUTTON_NAME,
} from "@/types/state";
import { storeToRefs } from "pinia";
import { useCourseStore } from "@/stores/courseStore";
import { useAppStore } from "@/stores/appStore";

const courseStore = useCourseStore();
const appStore = useAppStore();
const { courses, loading, error } = storeToRefs(courseStore);

onMounted(async () => {
  await courseStore.fetchCourseSummaries();
});

async function select(id: string) {
  // set the current course in the course store
  await courseStore.selectCourse(id);
  // tell the app store that a course button was pressed
  appStore.transition(new ButtonPressedStateTransition(COURSE_BUTTON_NAME));
}
</script>

<style scoped>
.course-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error {
  color: red;
}
</style>
