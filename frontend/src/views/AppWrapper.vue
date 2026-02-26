<template>
  <HomeView v-if="stateName === HOME_VIEW_STATE_NAME" />
  <CourseView v-else-if="stateName === COURSE_VIEW_STATE_NAME" />
  <CourseStudentsView
    v-else-if="stateName === COURSE_STUDENTS_VIEW_STATE_NAME"
  />
  <CourseAssignmentsView
    v-else-if="stateName === COURSE_ASSIGNMENTS_VIEW_STATE_NAME"
  />
  <AssignmentView v-else-if="stateName === ASSIGNMENT_VIEW_STATE_NAME" />
  <AssignmentQuestionsView
    v-else-if="stateName === ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME"
  />
  <QuestionView v-else-if="stateName === QUESTION_VIEW_STATE_NAME" />
  <GradeAssignmentView
    v-else-if="stateName === GRADE_ASSIGNMENT_VIEW_STATE_NAME"
  />
  <div v-else>Unknown state: {{ stateName }}</div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { computed } from "vue";
import HomeView from "@/views/HomeView.vue";
import CourseView from "@/views/CourseView.vue";
import QuestionView from "@/views/QuestionView.vue";
import CourseStudentsView from "@/views/CourseStudentsView.vue";
import CourseAssignmentsView from "@/views/CourseAssignmentsView.vue";
import AssignmentView from "@/views/AssignmentView.vue";
import AssignmentQuestionsView from "@/views/AssignmentQuestionsView.vue";
import GradeAssignmentView from "@/views/GradeAssignmentView.vue";
import {
  HOME_VIEW_STATE_NAME,
  COURSE_VIEW_STATE_NAME,
  COURSE_STUDENTS_VIEW_STATE_NAME,
  COURSE_ASSIGNMENTS_VIEW_STATE_NAME,
  ASSIGNMENT_VIEW_STATE_NAME,
  ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME,
  QUESTION_VIEW_STATE_NAME,
  GRADE_ASSIGNMENT_VIEW_STATE_NAME,
} from "@/types/state";

const store = useAppStore();

const stateName = computed(() => store.currentState.name);
</script>
