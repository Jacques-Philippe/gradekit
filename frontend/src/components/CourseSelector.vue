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
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCourseStore } from "@/stores/courseStore";

const courseStore = useCourseStore();

const { courses, loading, error } = storeToRefs(courseStore);
const router = useRouter();

onMounted(() => {
  courseStore.fetchCourseSummaries();
});

async function select(id: string) {
  await courseStore.selectCourse(id);
  router.push({ name: "course", params: { id } });
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
