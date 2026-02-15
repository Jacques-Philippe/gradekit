<template>
  <div class="course-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <BaseButton @click="goHome" aria-label="Back to course selection">
        <HouseIcon />
      </BaseButton>

      <p v-if="!courseStore.currentCourse" id="no-course-selected-warning">
        No course selected
      </p>
      <h1 v-else>{{ courseStore.currentCourse.name }}</h1>
    </nav>

    <!-- Page content -->
    <main>
      <BaseButton
        @click="goToAssignments"
        aria-label="Go to course assignments"
        :disabled="!courseStore.currentCourse"
      >
        Assignments
      </BaseButton>
      <BaseButton
        @click="goToStudents"
        aria-label="Go to course students"
        :disabled="!courseStore.currentCourse"
      >
        Students
      </BaseButton>
    </main>
  </div>
</template>

<script setup lang="ts">
import HouseIcon from "@/assets/House_01.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import { useCourseStore } from "@/stores/courseStore";
import { useAppStore } from "@/stores/appStore";
import {
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  STUDENTS_BUTTON_NAME,
  ASSIGNMENTS_BUTTON_NAME,
} from "@/types/state";

const courseStore = useCourseStore();
const appStore = useAppStore();

function goHome() {
  // Reset the current course in the course store
  courseStore.clearCourse();
  // Tell the app store that the back button was pressed
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
}

function goToStudents() {
  appStore.transition(new ButtonPressedStateTransition(STUDENTS_BUTTON_NAME));
}

function goToAssignments() {
  appStore.transition(
    new ButtonPressedStateTransition(ASSIGNMENTS_BUTTON_NAME),
  );
}
</script>
