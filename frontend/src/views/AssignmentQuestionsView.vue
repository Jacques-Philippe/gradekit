<template>
  <div class="assignment-questions-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <BaseButton @click="goBack" aria-label="Back to assignment">
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
        <h2 class="section-title">Questions</h2>

        <BaseLoadingSpinner v-if="questionStore.loading" />
        <ul
          v-else-if="questionStore.questions.length > 0"
          class="question-list"
        >
          <BaseListRow
            v-for="question in questionStore.questions"
            :key="question.id"
          >
            <div class="question-row">
              <div class="question-info">
                <span class="question-name">{{ question.questionText }}</span>
              </div>
            </div>
          </BaseListRow>
        </ul>
        <div
          v-else-if="!loading && questionStore.questions.length === 0"
          class="empty-state"
        >
          No questions in this assignment yet
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import BackIcon from "@/assets/Chevron_Left_MD.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseListRow from "@/components/base/BaseListRow.vue";
import BaseLoadingSpinner from "@/components/base/BaseLoadingSpinner.vue";
import { useAppStore } from "@/stores/appStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useQuestionStore } from "@/stores/questionStore";
import { ButtonPressedStateTransition, BACK_BUTTON_NAME } from "@/types/state";

const appStore = useAppStore();
const assignmentStore = useAssignmentStore();
const questionStore = useQuestionStore();

const error = ref("");

const loading = computed(
  () => questionStore.loading || assignmentStore.loading,
);

function goBack() {
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
}

onMounted(async () => {
  if (!assignmentStore.currentAssignment) {
    error.value = "No assignment selected";
    return;
  }
  await questionStore.getQuestionsByAssignmentId(
    assignmentStore.currentAssignment.id,
  );
  if (questionStore.error) {
    error.value = `Failed to load questions: ${questionStore.error}`;
    return;
  }
});
</script>

<style scoped>
.assignment-questions-view {
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

.section-title {
  margin: 0.5rem 0 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.question-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.question-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 1rem;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.question-name {
  font-weight: 500;
}

.question-description {
  font-size: 0.875rem;
  opacity: 0.9;
}

.question-points {
  flex-shrink: 0;
  font-size: 0.875rem;
}

.empty-state {
  color: var(--text-muted, #6b7280);
  padding: 1rem 0;
}

.error {
  color: red;
  font-weight: bold;
}
</style>
