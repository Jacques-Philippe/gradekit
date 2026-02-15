<template>
  <div class="course-students-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <BaseButton @click="goBack" aria-label="Back to course view">
        <BackIcon />
      </BaseButton>
    </nav>

    <!-- Page content -->
    <main>
      <div>Course Students View</div>
      <BaseConfirmModal
        v-model="confirmVisible"
        title="Delete Student"
        :message="`Are you sure you want to delete ${studentToDelete?.fullName}?`"
        confirmText="Delete"
        @confirm="confirmDelete"
      />

      <!-- Student creation input -->
      <BaseTextForm
        ref="studentForm"
        label="Student Name"
        placeholder="New student name"
        :button-text="studentStore.loading ? 'Creating...' : 'Create'"
        :loading="studentStore.loading"
        @submit="createStudent"
      />
      <!-- Student API failure message -->
      <div v-if="studentStore.error" class="error">
        {{ studentStore.error }}
      </div>
      <BaseLoadingSpinner v-if="studentStore.loading" />
      <!-- Students list, with deletion element -->
      <ul v-else-if="studentStore.students.length > 0" class="student-list">
        <BaseListRow v-for="student in studentStore.students" :key="student.id">
          {{ student.fullName }}

          <template #actions>
            <BaseButton
              variant="danger"
              @click="askDelete(student)"
              aria-label="Delete student"
            >
              <TrashIcon />
            </BaseButton>
          </template>
        </BaseListRow>
      </ul>
      <div v-else-if="studentStore.students.length === 0">
        No students in this course yet
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
import { useStudentStore } from "@/stores/studentStore";
import { ButtonPressedStateTransition, BACK_BUTTON_NAME } from "@/types/state";
import type { StudentSummary } from "@/types/student";

const studentForm = ref();

const appStore = useAppStore();

const studentStore = useStudentStore();
const courseStore = useCourseStore();

const confirmVisible = ref(false);
const studentToDelete = ref<StudentSummary | null>(null);

function askDelete(student: StudentSummary) {
  studentToDelete.value = student;
  confirmVisible.value = true;
}

async function confirmDelete() {
  if (!studentToDelete.value) return;

  if (!courseStore.currentCourse) {
    studentStore.error = "No course selected";
    return;
  }
  studentStore.error = ""; // Clear previous errors
  await studentStore.removeStudentFromCourse(
    studentToDelete.value!.id,
    courseStore.currentCourse.id,
  );
  studentToDelete.value = null;
}

function goBack() {
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
  studentStore.clearError();
}

// async function removeStudentFromCurrentCourse(studentId: string) {
//   if (!courseStore.currentCourse) {
//     studentStore.error = "No course selected";
//     return;
//   }
//   studentStore.error = ""; // Clear previous errors
//   await studentStore.removeStudentFromCourse(
//     studentId,
//     courseStore.currentCourse.id,
//   );
// }

async function createStudent(name: string) {
  if (!courseStore.currentCourse) {
    studentStore.error = "No course selected";
    return;
  }
  studentStore.error = ""; // Clear previous errors
  await studentStore.createStudent(name, [courseStore.currentCourse.id]);
  if (!studentStore.error) {
    studentForm.value?.reset();
  }
}

onMounted(async () => {
  if (!courseStore.currentCourse) {
    studentStore.error = "No course selected";
    return;
  }
  await studentStore.fetchStudentSummariesForCourse(
    courseStore.currentCourse.id,
  );
});
</script>
