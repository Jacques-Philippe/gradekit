<template>
  <div class="course-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <BaseButton @click="goBack" aria-label="Back">
        <BackIcon />
      </BaseButton>

      <p v-if="!courseStore.currentCourse" id="no-course-selected-warning">
        No current course selected
      </p>
      <div v-if="courseStore.currentCourse && questionStore.currentQuestion">
        <h1>Course {{ courseStore.currentCourse.name }}</h1>
        <h2>Assignment {{ assignmentStore.currentAssignment?.title }}</h2>
        <h3>Question {{ questionStore.currentQuestion.questionText }}</h3>
      </div>
    </nav>

    <!-- Page content -->
    <main>
      <h1>QuestionView content</h1>
    </main>
  </div>
</template>

<script setup lang="ts">
import BackIcon from "@/assets/Chevron_Left_MD.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import { useCourseStore } from "@/stores/courseStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useQuestionStore } from "@/stores/questionStore";
import { useAppStore } from "@/stores/appStore";
import { ButtonPressedStateTransition, BACK_BUTTON_NAME } from "@/types/state";

const appStore = useAppStore();
const courseStore = useCourseStore();
const assignmentStore = useAssignmentStore();
const questionStore = useQuestionStore();

function goBack() {
  questionStore.clearCurrentQuestion();
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
}
</script>
