<template>
  <div class="course-input">
    <h2>Enter a course name</h2>
    <form @submit.prevent="submitCourse">
      <input
        v-model="courseName"
        type="text"
        placeholder="New course name"
        id="course-name-input-text-box"
        required
      />
      <BaseButton :disabled="courseStore.loading" type="submit">
        {{ courseStore.loading ? "Creating..." : "Create" }}
      </BaseButton>
    </form>
    <p v-if="courseStore.error" class="error" id="course-creation-error">
      {{ courseStore.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";
import { ref } from "vue";
import { useCourseStore } from "@/stores/courseStore";

const courseStore = useCourseStore();
const courseName = ref("");

async function submitCourse() {
  await courseStore.createCourse(courseName.value);
  if (!courseStore.error) {
    courseName.value = "";
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
