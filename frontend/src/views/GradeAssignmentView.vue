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
      </div>
    </nav>

    <!-- Page content -->
    <main>
      <div v-if="!assignmentStore.currentAssignment" class="error">
        No assignment selected
      </div>
      <div v-else>
        <h1>{{ assignmentStore.currentAssignment.title }}</h1>
        <h2 class="section-title">GradeAssignmentView</h2>

        <!-- <BaseLoadingSpinner v-if="questionStore.loading" />
        <ul
          v-else-if="questionStore.questions.length > 0"
          class="assignment-list"
        >
          <BaseListRow
            v-for="assignment in questionStore.questions"
            :key="assignment.id"
          >
            <BaseButton
              type="button"
              class="assignment-button"
              @click="selectQuestion(assignment)"
              :aria-label="`Open assignment ${assignment.questionText}`"
            >
              {{ assignment.questionText }}
            </BaseButton>

            <template #actions>
              <BaseButton
                variant="danger"
                @click="askDelete(assignment)"
                aria-label="Delete assignment"
              >
                <TrashIcon />
              </BaseButton>
            </template>
          </BaseListRow>
        </ul>
        <div
          v-else-if="!loading && questionStore.questions.length === 0"
          class="empty-state"
        >
          No questions in this assignment yet
        </div> -->
      </div>
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
