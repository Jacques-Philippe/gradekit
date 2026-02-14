<template>
  <div class="course-input">
    <h2>Enter a course name</h2>
    <BaseTextForm
      ref="courseForm"
      label="Course Name"
      placeholder="New course name"
      :button-text="courseStore.loading ? 'Creating...' : 'Create'"
      :loading="courseStore.loading"
      @submit="submitCourse"
    />
    <p v-if="courseStore.error" class="error" id="course-creation-error">
      {{ courseStore.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import BaseTextForm from "@/components/base/BaseTextForm.vue";
import { ref } from "vue";
import { useCourseStore } from "@/stores/courseStore";

const courseStore = useCourseStore();
const courseForm = ref();

async function submitCourse(value: string) {
  courseStore.error = ""; // Clear previous errors
  const course = await courseStore.createCourse(value);
  if (course) {
    courseForm.value?.reset();
  }
}
</script>

<style scoped>
.course-input {
  max-width: 400px;
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
