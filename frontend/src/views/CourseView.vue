<template>
  <div class="course-page">
    <div v-if="loading" class="loading" data-testid="course-loading">
      Loading…
    </div>
    <div v-else-if="error" class="error-state" data-testid="course-error">
      {{ error }}
    </div>
    <template v-else-if="course">
      <h1 class="course-title" data-testid="course-name">{{ course.name }}</h1>

      <section class="course-section">
        <div class="section-header">
          <h2 class="section-heading">Students</h2>
          <div class="section-actions">
            <button
              class="btn-secondary"
              @click="goToStudents()"
              data-testid="add-student-btn"
            >
              Add Student
            </button>
            <button
              class="btn-secondary"
              @click="goToStudents('import')"
              data-testid="import-csv-btn"
            >
              Import CSV
            </button>
          </div>
        </div>
        <ul
          v-if="students.length"
          class="student-list"
          data-testid="student-list"
        >
          <li
            v-for="student in students"
            :key="student.id"
            class="student-item"
            :data-testid="`student-${student.id}`"
          >
            {{ student.full_name }}
          </li>
        </ul>
        <p v-else class="empty-state" data-testid="students-empty">
          No students enrolled yet.
        </p>
      </section>

      <section class="course-section">
        <h2 class="section-heading">Assignments</h2>
        <p class="empty-state" data-testid="assignments-placeholder">
          Assignments coming in Phase 3.
        </p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiGetCourse, type Course } from "@/api/courses";
import { apiGetStudents, type Student } from "@/api/students";
import { courseStudentsRoute } from "@/router/routes";

const route = useRoute();
const router = useRouter();

const courseId = Number(route.params.id);

const course = ref<Course | null>(null);
const students = ref<Student[]>([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  const [courseResult, studentsResult] = await Promise.all([
    apiGetCourse(courseId),
    apiGetStudents(courseId),
  ]);
  loading.value = false;
  if (!courseResult.ok) {
    error.value = courseResult.error;
    return;
  }
  course.value = courseResult.data;
  if (studentsResult.ok) students.value = studentsResult.data;
});

function goToStudents(tab?: string) {
  const path = courseStudentsRoute(courseId);
  router.push(tab ? `${path}?tab=${tab}` : path);
}
</script>

<style scoped>
.course-page {
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
}

.course-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a2844;
  margin: 0 0 28px;
}

.course-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-heading {
  font-size: 14px;
  font-weight: 600;
  color: #1a2844;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.btn-secondary {
  font-size: 13px;
  font-weight: 500;
  color: #1a2844;
  background: transparent;
  border: 1px solid #1a2844;
  border-radius: 6px;
  padding: 5px 12px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f5f6f8;
}

.student-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.student-item {
  font-size: 14px;
  color: #111827;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.empty-state {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.loading {
  font-size: 14px;
  color: #6b7280;
}

.error-state {
  font-size: 14px;
  color: #dc2626;
}
</style>
