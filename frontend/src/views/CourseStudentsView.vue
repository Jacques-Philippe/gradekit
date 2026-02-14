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
      <!-- Student creation input -->
      <BaseTextForm
        ref="studentForm"
        label="Student Name"
        placeholder="New student name"
        :button-text="studentStore.loading ? 'Creating...' : 'Create'"
        :loading="studentStore.loading"
        @submit="createStudent"
      />
      <!-- Students list, with deletion element -->
      <div v-if="studentStore.error" class="error">
        {{ studentStore.error }}
      </div>
      <ul>
        <li v-for="student in studentStore.students" :key="student.id">
          {{ student.fullName }}
          <BaseButton
            @click="deleteStudent(student.id)"
            aria-label="Delete student"
          >
            Delete
          </BaseButton>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BackIcon from "@/assets/Chevron_Left_MD.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseTextForm from "@/components/base/BaseTextForm.vue";
import { useAppStore } from "@/stores/appStore";
import { useCourseStore } from "@/stores/courseStore";
import { useStudentStore } from "@/stores/studentStore";
import { ButtonPressedStateTransition, BACK_BUTTON_NAME } from "@/types/state";

const studentForm = ref();

const appStore = useAppStore();

const studentStore = useStudentStore();
const courseStore = useCourseStore();

function goBack() {
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
}

async function deleteStudent(id: string) {
  await studentStore.deleteStudent(id);
}

async function createStudent(name: string) {
  studentStore.error = ""; // Clear previous errors
  await studentStore.createStudent(name);
  if (!studentStore.error) {
    studentForm.value?.reset();
  }
}

onMounted(async () => {
  await studentStore.fetchStudentSummariesForCourse(
    courseStore.currentCourse?.id || "",
  );
});
</script>
