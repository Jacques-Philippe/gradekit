<template>
  <div class="course-assignments-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <BaseButton @click="goBack" aria-label="Back to course view">
        <BackIcon />
      </BaseButton>
    </nav>

    <!-- Page content -->
    <main>
      <div>Course Assignments View</div>
      <!-- Modal for removing an assignment from a course -->
      <BaseConfirmModal
        v-model="confirmVisible"
        title="Remove Assignment"
        :message="`Are you sure you want to remove assignment ${assignmentToDelete?.title} from ${courseStore.currentCourse?.name}?`"
        confirmText="Remove"
        @confirm="confirmDelete"
      />

      <!-- Assignment creation input -->
      <BaseTextForm
        ref="assignmentForm"
        label="Assignment Title"
        placeholder="New assignment title"
        :button-text="assignmentStore.loading ? 'Creating...' : 'Create'"
        :loading="assignmentStore.loading"
        @submit="addAssignmentToCurrentCourse"
      />
      <!-- Assignment API failure message -->
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <BaseLoadingSpinner v-if="assignmentStore.loading" />
      <!-- Assignment list, with deletion element -->
      <ul
        v-else-if="assignmentStore.assignments.length > 0"
        class="assignment-list"
      >
        <BaseListRow
          v-for="assignment in assignmentStore.assignments"
          :key="assignment.id"
        >
          {{ assignment.title }}

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
      <div v-else-if="assignmentStore.assignments.length === 0">
        No assignments in this course yet
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BackIcon from "@/assets/Chevron_Left_MD.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseListRow from "@/components/base/BaseListRow.vue";
import BaseTextForm from "@/components/base/BaseTextForm.vue";
import BaseLoadingSpinner from "@/components/base/BaseLoadingSpinner.vue";
import BaseConfirmModal from "@/components/base/BaseConfirmModal.vue";
import TrashIcon from "@/assets/Trash_Full.svg";
import { useAppStore } from "@/stores/appStore";
import { useCourseStore } from "@/stores/courseStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { ButtonPressedStateTransition, BACK_BUTTON_NAME } from "@/types/state";
import type { Assignment } from "@/types/assignment";

const assignmentForm = ref();

const appStore = useAppStore();
const courseStore = useCourseStore();
const assignmentStore = useAssignmentStore();

const error = ref("");
const confirmVisible = ref(false);
const assignmentToDelete = ref<Assignment | null>(null);

function askDelete(assignment: Assignment) {
  assignmentToDelete.value = assignment;
  confirmVisible.value = true;
}

async function confirmDelete() {
  if (!assignmentToDelete.value) return;

  if (!courseStore.currentCourse) {
    error.value = "No course selected";
    return;
  }
  error.value = ""; // Clear previous errors
  await assignmentStore.deleteAssignment(assignmentToDelete.value.id);
  if (assignmentStore.error) {
    error.value = `Failed to remove assignment from course: ${assignmentStore.error}`;
    return;
  }
  assignmentToDelete.value = null;
}

function goBack() {
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
  error.value = ""; // Clear previous errors
}

async function addAssignmentToCurrentCourse(assignmentTitle: string) {
  if (!courseStore.currentCourse) {
    error.value = "No course selected";
    return;
  }
  error.value = ""; // Clear previous errors
  await assignmentStore.createAssignment(assignmentTitle, "");
  if (!error.value) {
    assignmentForm.value?.reset();
  }
}

onMounted(async () => {
  if (!courseStore.currentCourse) {
    error.value = "No course selected";
    return;
  }
  // get all assignments
  await assignmentStore.getAssignmentsByCourseId(courseStore.currentCourse.id);
});
</script>
