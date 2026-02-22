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
        title="Remove Student"
        :message="`Are you sure you want to remove ${
          enrollmentToDelete ? studentNameForEnrollment(enrollmentToDelete) : ''
        } from ${courseStore.currentCourse?.name}?`"
        confirmText="Remove"
        @confirm="confirmDelete"
      />

      <!-- Student creation input -->
      <BaseTextForm
        ref="studentForm"
        label="Student Name"
        placeholder="New student name"
        :button-text="loading ? 'Creating...' : 'Create'"
        :loading="loading"
        @submit="createEnrollment"
      />
      <!-- Student API failure message -->
      <div v-if="error" class="error">
        {{ error }}
      </div>
      <BaseLoadingSpinner v-if="loading" />
      <!-- Students list, with deletion element -->
      <ul
        v-else-if="enrollmentStore.enrollments.length > 0"
        class="student-list"
      >
        <BaseListRow
          v-for="enrollment in enrollmentStore.enrollments"
          :key="enrollment.id"
        >
          {{ studentNameForEnrollment(enrollment) }}

          <template #actions>
            <BaseButton
              variant="danger"
              @click="askDelete(enrollment)"
              aria-label="Delete student"
            >
              <TrashIcon />
            </BaseButton>
          </template>
        </BaseListRow>
      </ul>
      <div v-else-if="enrollmentStore.enrollments.length === 0">
        No students in this course yet
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import BackIcon from "@/assets/Chevron_Left_MD.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseListRow from "@/components/base/BaseListRow.vue";
import BaseTextForm from "@/components/base/BaseTextForm.vue";
import BaseLoadingSpinner from "@/components/base/BaseLoadingSpinner.vue";
import BaseConfirmModal from "@/components/base/BaseConfirmModal.vue";
import TrashIcon from "@/assets/Trash_Full.svg";
import { useAppStore } from "@/stores/appStore";
import { useCourseStore } from "@/stores/courseStore";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { useStudentStore } from "@/stores/studentStore";
import { ButtonPressedStateTransition, BACK_BUTTON_NAME } from "@/types/state";
import type { Enrollment } from "@/types/enrollment";

const studentForm = ref();
const error = ref<string>("");
const loading = computed(() => studentStore.loading || enrollmentStore.loading);

const appStore = useAppStore();
const studentStore = useStudentStore();
const courseStore = useCourseStore();
const enrollmentStore = useEnrollmentStore();

const confirmVisible = ref(false);
const enrollmentToDelete = ref<Enrollment | null>(null);

function studentNameForEnrollment(enrollment: Enrollment): string {
  const student = studentStore.students.find(
    (s) => s.id === enrollment.studentId,
  );
  return student?.fullName ?? enrollment.studentId;
}

function askDelete(enrollment: Enrollment) {
  enrollmentToDelete.value = enrollment;
  confirmVisible.value = true;
}

async function confirmDelete() {
  if (!enrollmentToDelete.value) return;

  if (!courseStore.currentCourse) {
    error.value = "No course selected";
    return;
  }
  error.value = ""; // Clear previous errors
  const enrollment = await enrollmentStore.getEnrollmentByStudentAndCourse(
    enrollmentToDelete.value.studentId,
    courseStore.currentCourse.id,
  );
  if (!enrollment || enrollmentStore.error) {
    error.value = `Failed to remove student from course: ${enrollmentStore.error}`;
    return;
  }
  await enrollmentStore.deleteEnrollment(enrollment.id);

  // get all students for the enrollments
  await studentStore.getStudentsForIdsApi(
    enrollmentStore.enrollments.map((e) => e.studentId),
  );
  enrollmentToDelete.value = null;
}

function goBack() {
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
  studentStore.clearError();
}

async function createEnrollment(studentId: string) {
  if (!courseStore.currentCourse) {
    error.value = "No course selected";
    return;
  }
  error.value = ""; // Clear previous errors
  await enrollmentStore.createEnrollment(
    studentId,
    courseStore.currentCourse.id,
  );
  if (enrollmentStore.error) {
    error.value = `Failed to add student to course: ${enrollmentStore.error}`;
    return;
  }
  // get all students for the enrollments
  await studentStore.getStudentsForIdsApi(
    enrollmentStore.enrollments.map((e) => e.studentId),
  );
  if (!studentStore.error) {
    studentForm.value?.reset();
  }
}

onMounted(async () => {
  if (!courseStore.currentCourse) {
    error.value = "No course selected";
    return;
  }
  // get all enrollments
  await enrollmentStore.getEnrollmentsByCourse(courseStore.currentCourse.id);
  // get all students for the enrollments
  await studentStore.getStudentsForIdsApi(
    enrollmentStore.enrollments.map((e) => e.studentId),
  );
});
</script>
