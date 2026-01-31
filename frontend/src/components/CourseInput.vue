<template>
  <div class="course-input">
    <h2>Enter a course name</h2>
    <form @submit.prevent="submitCourse">
      <input
        v-model="courseName"
        type="text"
        placeholder="Course name"
        required
      />
      <button type="submit" :disabled="loading">
        {{ loading ? "Submitting..." : "Submit" }}
      </button>
    </form>
    <p v-if="responseMessage" :class="{ error: isError }">
      {{ responseMessage }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { submitCourseName } from "@/api/mock/courses";

export default defineComponent({
  name: "CourseInput",
  setup() {
    const courseName = ref("");
    const responseMessage = ref("");
    const isError = ref(false);
    const loading = ref(false);

    async function submitCourse() {
      loading.value = true;
      responseMessage.value = "";
      isError.value = false;
      try {
        const result = await submitCourseName(courseName.value);
        responseMessage.value = `Course submitted: ${result.name} (id: ${result.id})`;
      } catch (err) {
        responseMessage.value = `Error submitting course: ${err}`;
        isError.value = true;
      } finally {
        loading.value = false;
      }
    }

    return {
      courseName,
      responseMessage,
      isError,
      loading,
      submitCourse,
    };
  },
});
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
