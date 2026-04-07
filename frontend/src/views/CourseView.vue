<template>
  <div class="course-page">
    <div v-if="loading" class="loading" data-testid="course-loading">
      {{ t("course.loading") }}
    </div>
    <div v-else-if="error" class="error-state" data-testid="course-error">
      {{ error }}
    </div>
    <template v-else-if="course">
      <div class="course-header">
        <h1 class="course-title" data-testid="course-name">
          {{ course.name }}
        </h1>
        <button
          class="btn-secondary"
          @click="openEditModal"
          data-testid="edit-course-btn"
        >
          {{ t("course.edit") }}
        </button>
      </div>

      <section class="course-section">
        <div class="section-header">
          <h2 class="section-heading">{{ t("course.students_heading") }}</h2>
          <div class="section-actions">
            <button
              class="btn-secondary"
              @click="goToStudents()"
              data-testid="add-student-btn"
            >
              {{ t("course.add_student") }}
            </button>
            <button
              class="btn-secondary"
              @click="goToStudents('import')"
              data-testid="import-csv-btn"
            >
              {{ t("course.import_csv") }}
            </button>
          </div>
        </div>
        <p
          v-if="studentsError"
          class="error-state"
          data-testid="students-error"
        >
          {{ studentsError }}
        </p>
        <ul
          v-else-if="students.length"
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
          {{ t("course.no_students") }}
        </p>
      </section>

      <section class="course-section">
        <h2 class="section-heading">{{ t("course.assignments_heading") }}</h2>
        <p class="empty-state" data-testid="assignments-placeholder">
          {{ t("course.assignments_placeholder") }}
        </p>
      </section>
    </template>

    <!-- Edit Course modal -->
    <div
      v-if="showEditModal && course"
      class="modal-backdrop"
      data-testid="edit-modal"
      @click.self="closeEditModal"
    >
      <div class="modal">
        <h2 class="modal-heading">{{ t("course.edit_course") }}</h2>
        <form @submit.prevent="submitEditCourse" data-testid="edit-course-form">
          <div class="modal-field">
            <input
              v-model="editName"
              class="modal-input"
              type="text"
              :placeholder="t('course.course_name_placeholder')"
              autofocus
              data-testid="edit-course-input"
            />
          </div>
          <div class="modal-field">
            <textarea
              v-model="editDescription"
              class="modal-textarea"
              :placeholder="t('course.description_placeholder')"
              rows="2"
              data-testid="edit-course-description"
            />
          </div>
          <p v-if="editError" class="form-error" data-testid="edit-error">
            {{ editError }}
          </p>
          <div class="modal-actions">
            <button
              type="submit"
              class="btn-primary"
              :disabled="editPending"
              data-testid="edit-course-submit"
            >
              {{ t("course.save") }}
            </button>
            <button
              type="button"
              class="btn-cancel"
              @click="closeEditModal"
              data-testid="edit-course-cancel"
            >
              {{ t("course.cancel") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { apiGetCourse, apiUpdateCourse, type Course } from "@/api/courses";
import { apiGetStudents, type Student } from "@/api/students";
import { localizeError } from "@/utils/localizeError";
import { courseStudentsRoute } from "@/router/routes";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const courseId = Number(route.params.id);

const course = ref<Course | null>(null);
const students = ref<Student[]>([]);
const loading = ref(true);
const error = ref("");
const studentsError = ref("");

const showEditModal = ref(false);
const editName = ref("");
const editDescription = ref("");
const editPending = ref(false);
const editError = ref("");

onMounted(async () => {
  const [courseResult, studentsResult] = await Promise.all([
    apiGetCourse(courseId),
    apiGetStudents(courseId),
  ]);
  loading.value = false;
  if (!courseResult.ok) {
    error.value = localizeError(courseResult.error);
    return;
  }
  course.value = courseResult.data;
  if (studentsResult.ok) {
    students.value = studentsResult.data;
  } else {
    studentsError.value = t("course.students_error");
  }
});

function openEditModal() {
  if (!course.value) return;
  editName.value = course.value.name;
  editDescription.value = course.value.description ?? "";
  editError.value = "";
  showEditModal.value = true;
}

function closeEditModal() {
  if (editPending.value) return;
  showEditModal.value = false;
  editName.value = "";
  editDescription.value = "";
  editError.value = "";
}

async function submitEditCourse() {
  if (!course.value) return;
  const name = editName.value.trim();
  if (!name) return;
  editPending.value = true;
  editError.value = "";
  const result = await apiUpdateCourse(course.value.id, {
    name,
    description: editDescription.value.trim() || undefined,
  });
  editPending.value = false;
  if (!result.ok) {
    editError.value = localizeError(result.error);
    return;
  }
  course.value = result.data;
  closeEditModal();
}

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

.course-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.course-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a2844;
  margin: 0;
}

.btn-primary {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  background: #1a2844;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 8px 14px;
  font-size: 14px;
  background: #f5f6f8;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #ffffff;
  border-radius: 10px;
  padding: 24px;
  width: 380px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.modal-heading {
  font-size: 16px;
  font-weight: 600;
  color: #1a2844;
  margin: 0 0 16px;
}

.modal-field {
  margin-bottom: 10px;
}

.modal-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: #1a2844;
}

.modal-textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
}

.modal-textarea:focus {
  border-color: #1a2844;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

.form-error {
  font-size: 13px;
  color: #dc2626;
  margin: 0 0 8px;
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
