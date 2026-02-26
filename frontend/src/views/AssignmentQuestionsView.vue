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
      <BaseConfirmModal
        v-model="confirmVisible"
        title="Remove Question"
        :message="`Are you sure you want to remove question ${questionToDelete?.questionText} from ${assignmentStore.currentAssignment?.title}?`"
        confirmText="Remove"
        @confirm="confirmDelete"
      />
      <div v-if="!assignmentStore.currentAssignment" class="error">
        No assignment selected
      </div>
      <div v-else>
        <h1>{{ assignmentStore.currentAssignment.title }}</h1>
        <h2 class="section-title">Questions</h2>

        <BaseLoadingSpinner v-if="loading" />
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
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import BackIcon from "@/assets/Chevron_Left_MD.svg";
import TrashIcon from "@/assets/Trash_Full.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseListRow from "@/components/base/BaseListRow.vue";
import BaseLoadingSpinner from "@/components/base/BaseLoadingSpinner.vue";
import BaseConfirmModal from "@/components/base/BaseConfirmModal.vue";
import { useAppStore } from "@/stores/appStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useQuestionStore } from "@/stores/questionStore";
import {
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  QuestionButtonPressedStateTransition,
} from "@/types/state";
import type { Question } from "@/types/question";

const appStore = useAppStore();
const assignmentStore = useAssignmentStore();
const questionStore = useQuestionStore();

const error = ref("");
const confirmVisible = ref(false);
const questionToDelete = ref<Question | null>(null);

const loading = computed(
  () => questionStore.loading || assignmentStore.loading,
);

function goBack() {
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
}

function askDelete(question: Question) {
  questionToDelete.value = question;
  confirmVisible.value = true;
}

async function confirmDelete() {
  if (!questionToDelete.value) return;

  error.value = ""; // Clear previous errors
  await questionStore.deleteQuestion(questionToDelete.value.id);
  if (questionStore.error) {
    error.value = `Failed to remove question from assignment: ${questionStore.error}`;
    return;
  }
  questionToDelete.value = null;
}
async function selectQuestion(_question: Question) {
  await questionStore.setCurrentQuestion(_question);
  appStore.transition(new QuestionButtonPressedStateTransition(_question.id));
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
