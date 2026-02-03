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
import { useRouter } from "vue-router";

const courseStore = useCourseStore();
const router = useRouter();
const courseName = ref("");

async function submitCourse() {
  const course = await courseStore.createCourse(courseName.value);
  // if there's no error, reset the input field
  if (!courseStore.error && course) {
    courseName.value = "";
    router.push({ name: "course", params: { id: course.id } });
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
