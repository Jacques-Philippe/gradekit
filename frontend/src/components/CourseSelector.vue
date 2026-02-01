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
      >
        {{ course.name }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCourseStore } from "@/stores/courseStore";

const courseStore = useCourseStore();

// make state reactive in template
const { courses, loading, error } = storeToRefs(courseStore);

onMounted(() => {
  courseStore.fetchCourseSummaries();
});

function select(id: string) {
  courseStore.selectCourse(id);
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
