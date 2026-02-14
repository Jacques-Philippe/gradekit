<template>
  <div class="course-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <button
        class="icon-button"
        @click="goHome"
        aria-label="Back to course selection"
      >
        <HouseIcon />
      </button>

      <p v-if="!courseStore.currentCourse" id="no-course-selected-warning">
        No course selected
      </p>
      <h1 v-else>{{ courseStore.currentCourse.name }}</h1>
    </nav>

    <!-- Page content -->
    <main>
      <!-- rest of your course UI -->
    </main>
  </div>
</template>

<script setup lang="ts">
import HouseIcon from "@/assets/House_01.svg";
import { useCourseStore } from "@/stores/courseStore";
import { useAppStore } from "@/stores/appStore";
import { ButtonPressedStateTransition, BACK_BUTTON_NAME } from "@/types/state";

const courseStore = useCourseStore();
const appStore = useAppStore();

function goHome() {
  // Reset the current course in the course store
  courseStore.clearCourse();
  // Tell the app store that the back button was pressed
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
}
</script>
