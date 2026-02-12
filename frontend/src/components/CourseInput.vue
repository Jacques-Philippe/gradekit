<template>
  <div class="course-input">
    <h2>Enter a course name</h2>
    <form @submit.prevent="submitCourse">
      <input
        v-model="courseName"
        type="text"
        placeholder="Course name"
        id="course-name-input-text-box"
        required
      />
      <button :disabled="courseStore.loading">
        {{ courseStore.loading ? "Submitting..." : "Submit" }}
      </button>
    </form>
    <p v-if="courseStore.currentCourse">
      Current course: {{ courseStore.currentCourse.name }} (id:
      {{ courseStore.currentCourse.id }})
    </p>
    <p v-if="courseStore.error" class="error" id="course-creation-error">
      {{ courseStore.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCourseStore } from "@/stores/courseStore";
import { useAppStore } from "@/stores/appStore";
import {
  FormSubmittedStateTransition,
  NEW_COURSE_FORM_NAME,
} from "@/types/state";

const courseStore = useCourseStore();
const appStore = useAppStore();
const courseName = ref("");

async function submitCourse() {
  const course = await courseStore.createCourse(courseName.value);
  // if there's no error, reset the input field
  if (!courseStore.error && course) {
    // Select the created course
    await courseStore.selectCourse(course.id);
    // Tell the appstore that the new course form is submitted
    appStore.transition(new FormSubmittedStateTransition(NEW_COURSE_FORM_NAME));
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
