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
      Current course: {{ store.currentCourse.name }} (id:
      {{ store.currentCourse.id }})
    </p>
    <p v-if="store.error" class="error" id="course-creation-error">
      {{ store.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCourseStore } from "@/stores/courseStore";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const courseStore = useCourseStore();
const { currentCourse } = storeToRefs(courseStore);
const router = useRouter();
const courseName = ref("");
const store = useCourseStore();

async function submitCourse() {
  await store.createCourse(courseName.value);
  // if there's no error, don't reset the input field
  if (!store.error) {
    courseName.value = "";
  }
  if (currentCourse) {
    router.push({
      name: "course",
      params: { id: currentCourse.value?.id },
    });
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
