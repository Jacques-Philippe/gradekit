<template>
  <div class="assignment-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <BaseButton @click="goBack" aria-label="Back to course assignments">
        <BackIcon />
      </BaseButton>
    </nav>

    <!-- Page content -->
    <main>
      <div v-if="!assignmentStore.currentAssignment" class="error">
        No assignment selected
      </div>
      <div v-else>
        <h1>{{ assignmentStore.currentAssignment.title }}</h1>
        <p v-if="courseStore.currentCourse">
          Course: {{ courseStore.currentCourse.name }}
        </p>
        <p v-else class="error">No course selected</p>

        <div class="button-group">
          <BaseButton
            @click="goToEditQuestions"
            aria-label="Edit questions"
            :disabled="!assignmentStore.currentAssignment"
          >
            Edit Questions
          </BaseButton>
          <BaseButton
            @click="goToGradeQuestions"
            aria-label="Grade questions"
            :disabled="!assignmentStore.currentAssignment"
          >
            Grade Questions
          </BaseButton>
          <BaseButton
            @click="exportGrades"
            aria-label="Export grades"
            :disabled="!assignmentStore.currentAssignment"
          >
            Export Grades
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import BackIcon from "@/assets/Chevron_Left_MD.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import { useAppStore } from "@/stores/appStore";
import { useCourseStore } from "@/stores/courseStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import {
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  EDIT_QUESTION_BUTTON_NAME,
  GRADE_BUTTON_NAME,
  EXPORT_GRADES_BUTTON_NAME,
} from "@/types/state";

const appStore = useAppStore();
const courseStore = useCourseStore();
const assignmentStore = useAssignmentStore();

function goBack() {
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
}

function goToEditQuestions() {
  appStore.transition(
    new ButtonPressedStateTransition(EDIT_QUESTION_BUTTON_NAME),
  );
}

function goToGradeQuestions() {
  appStore.transition(new ButtonPressedStateTransition(GRADE_BUTTON_NAME));
}

function exportGrades() {
  appStore.transition(
    new ButtonPressedStateTransition(EXPORT_GRADES_BUTTON_NAME),
  );
}

onMounted(async () => {
  // TODO: Load current assignment if needed
  // This might need to be set when navigating from CourseAssignmentsView
});
</script>

<style scoped>
.assignment-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

main {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
