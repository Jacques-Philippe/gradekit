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
      <button :disabled="store.loading">
        {{ store.loading ? "Submitting..." : "Submit" }}
      </button>
    </form>
    <p v-if="store.currentCourse">
      Course submitted: {{ store.currentCourse.name }} (id:
      {{ store.currentCourse.id }})
    </p>
    <p v-if="store.error" class="error">{{ store.error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useCourseStore } from "@/stores/courseStore";

export default defineComponent({
  setup() {
    const courseName = ref("");
    const store = useCourseStore();

    async function submitCourse() {
      await store.createCourse(courseName.value);
      if (!store.error) {
        courseName.value = "";
      }
    }

    return {
      courseName, // needed for v-model
      store, // needed for template access
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
