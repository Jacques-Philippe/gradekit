<template>
  <main>
    <!-- Course Input Section -->
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

    <!-- Course Selector Section -->
    <section>
      <BaseLoadingSpinner v-if="loading" />
      <p v-else-if="!loading && error.length > 0" class="error">
        Unable to access courses <br />
        {{ error }}
      </p>
      <div v-else class="course-list">
        <BaseButton
          v-for="course in courses"
          :key="course.id"
          :data-test="`course-${course.id}`"
          :disabled="loading"
          @click="select(course.id)"
          type="button"
        >
          {{ course.name }}
        </BaseButton>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  ButtonPressedStateTransition,
  COURSE_BUTTON_NAME,
} from "@/types/state";
import { storeToRefs } from "pinia";
import { useCourseStore } from "@/stores/courseStore";
import { useAppStore } from "@/stores/appStore";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseLoadingSpinner from "@/components/base/BaseLoadingSpinner.vue";
import BaseTextForm from "@/components/base/BaseTextForm.vue";

const courseStore = useCourseStore();
const appStore = useAppStore();
const { loading, error, courses } = storeToRefs(courseStore);
const courseForm = ref<InstanceType<typeof BaseTextForm>>();

async function submitCourse(value: string) {
  courseStore.error = ""; // Clear previous errors
  await courseStore.createCourse(value);
  if (courseStore.error) {
    courseForm.value?.reset();
  }
}

onMounted(async () => {
  await courseStore.getCourses();
});

async function select(id: string) {
  // set the current course in the course store
  await courseStore.selectCourse(id);
  // tell the app store that a course button was pressed
  appStore.transition(new ButtonPressedStateTransition(COURSE_BUTTON_NAME));
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

.error {
  color: red;
  font-weight: bold;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
