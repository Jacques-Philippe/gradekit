<template>
  <div class="my-courses-page">
    <div class="page-header">
      <h1 class="page-heading" data-testid="page-heading">
        {{ t("my_courses.heading") }}
      </h1>
      <button
        class="btn-primary"
        @click="showCreateModal = true"
        data-testid="new-course-btn"
      >
        {{ t("my_courses.new_course") }}
      </button>
    </div>

    <div class="filters">
      <input
        v-model="searchQuery"
        class="filter-input filter-search"
        type="text"
        :placeholder="t('my_courses.search_placeholder')"
        data-testid="search-input"
      />
    </div>

    <div v-if="loading" class="empty-state" data-testid="courses-loading">
      {{ t("course.loading") }}
    </div>
    <template v-else>
      <p
        v-if="courses.length === 0"
        class="empty-state"
        data-testid="no-courses"
      >
        {{ t("my_courses.no_courses") }}
      </p>
      <p
        v-else-if="filteredCourses.length === 0"
        class="empty-state"
        data-testid="no-courses-filtered"
      >
        {{ t("my_courses.no_courses_filtered") }}
      </p>
      <table v-else class="courses-table" data-testid="courses-table">
        <thead>
          <tr>
            <th class="col-name">{{ t("my_courses.col_name") }}</th>
            <th class="col-description">
              {{ t("my_courses.col_description") }}
            </th>
            <th class="col-actions">{{ t("my_courses.col_actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="course in filteredCourses"
            :key="course.id"
            :data-testid="`course-row-${course.id}`"
          >
            <td class="col-name">{{ course.name }}</td>
            <td class="col-description cell-muted">
              {{ course.description || t("my_courses.no_description") }}
            </td>
            <td class="col-actions">
              <div class="action-btns">
                <button
                  class="btn-view"
                  @click="router.push(courseRoute(course.id))"
                  :data-testid="`view-course-${course.id}`"
                >
                  {{ t("my_courses.view") }}
                </button>
                <button
                  class="btn-delete"
                  @click="confirmingCourse = course"
                  :data-testid="`delete-course-${course.id}`"
                >
                  {{ t("my_courses.delete") }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- New Course modal -->
    <div
      v-if="showCreateModal"
      class="modal-backdrop"
      data-testid="create-modal"
      @click.self="closeCreateModal"
    >
      <div class="modal">
        <h2 class="modal-heading">{{ t("my_courses.new_course") }}</h2>
        <form
          @submit.prevent="submitCreateCourse"
          data-testid="create-course-form"
        >
          <div class="modal-field">
            <input
              v-model="newName"
              class="modal-input"
              type="text"
              :placeholder="t('my_courses.course_name_placeholder')"
              autofocus
              data-testid="create-course-input"
            />
          </div>
          <div class="modal-field">
            <textarea
              v-model="newDescription"
              class="modal-textarea"
              :placeholder="t('my_courses.description_placeholder')"
              rows="2"
              data-testid="create-course-description"
            />
          </div>
          <p v-if="createError" class="form-error" data-testid="create-error">
            {{ createError }}
          </p>
          <div class="modal-actions">
            <button
              type="submit"
              class="btn-primary"
              :disabled="createPending"
              data-testid="create-course-submit"
            >
              {{ t("my_courses.create") }}
            </button>
            <button
              type="button"
              class="btn-cancel"
              @click="closeCreateModal"
              data-testid="create-course-cancel"
            >
              {{ t("my_courses.cancel") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div
      v-if="confirmingCourse"
      class="modal-backdrop"
      data-testid="delete-modal"
      @click.self="confirmingCourse = null"
    >
      <div class="modal">
        <p class="modal-message">
          {{ t("my_courses.delete_confirm", { name: confirmingCourse.name }) }}
        </p>
        <div class="modal-actions">
          <button
            class="btn-danger"
            :disabled="deletingId !== null"
            @click="confirmDelete"
            data-testid="confirm-delete-btn"
          >
            {{ t("my_courses.delete") }}
          </button>
          <button
            class="btn-cancel"
            @click="confirmingCourse = null"
            data-testid="cancel-delete-btn"
          >
            {{ t("my_courses.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  apiGetCourses,
  apiCreateCourse,
  apiDeleteCourse,
  type Course,
} from "@/api/courses";
import { localizeError } from "@/utils/localizeError";
import { courseRoute } from "@/router/routes";

const { t } = useI18n();
const router = useRouter();

const courses = ref<Course[]>([]);
const loading = ref(true);

const searchQuery = ref("");

const showCreateModal = ref(false);
const newName = ref("");
const newDescription = ref("");
const createPending = ref(false);
const createError = ref("");

const confirmingCourse = ref<Course | null>(null);
const deletingId = ref<number | null>(null);

const filteredCourses = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return courses.value;
  return courses.value.filter((c) => {
    const inName = c.name.toLowerCase().includes(q);
    const inDesc = (c.description ?? "").toLowerCase().includes(q);
    return inName || inDesc;
  });
});

onMounted(async () => {
  const result = await apiGetCourses();
  loading.value = false;
  if (result.ok) courses.value = result.data;
});

function closeCreateModal() {
  showCreateModal.value = false;
  newName.value = "";
  newDescription.value = "";
  createError.value = "";
}

async function submitCreateCourse() {
  const name = newName.value.trim();
  if (!name) return;
  createPending.value = true;
  createError.value = "";
  const result = await apiCreateCourse({
    name,
    description: newDescription.value.trim() || undefined,
  });
  createPending.value = false;
  if (!result.ok) {
    createError.value = localizeError(result.error);
    return;
  }
  courses.value = [...courses.value, result.data];
  closeCreateModal();
}

async function confirmDelete() {
  if (!confirmingCourse.value) return;
  const id = confirmingCourse.value.id;
  deletingId.value = id;
  const result = await apiDeleteCourse(id);
  deletingId.value = null;
  confirmingCourse.value = null;
  if (!result.ok) return;
  courses.value = courses.value.filter((c) => c.id !== id);
}
</script>

<style scoped>
.my-courses-page {
  padding: 32px;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-heading {
  font-size: 22px;
  font-weight: 700;
  color: #1a2844;
  margin: 0;
}

.filters {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-input {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  background: #ffffff;
}

.filter-input:focus {
  border-color: #1a2844;
}

.filter-search {
  flex: 1;
  min-width: 200px;
}

.empty-state {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
  padding: 24px 0;
}

.courses-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.courses-table thead tr {
  border-bottom: 2px solid #e5e7eb;
}

.courses-table th {
  text-align: left;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.courses-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
}

.courses-table tbody tr:last-child {
  border-bottom: none;
}

.courses-table td {
  padding: 11px 12px;
  color: #111827;
  vertical-align: middle;
}

.cell-muted {
  color: #6b7280;
}

.col-name {
  width: 200px;
  font-weight: 500;
}

.col-description {
  flex: 1;
}

.col-actions {
  width: 140px;
}

.action-btns {
  display: flex;
  gap: 6px;
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

.btn-view {
  font-size: 12px;
  color: #1a2844;
  background: none;
  border: 1px solid #1a2844;
  border-radius: 4px;
  padding: 3px 8px;
  cursor: pointer;
}

.btn-view:hover {
  background: #f0f2f7;
}

.btn-delete {
  font-size: 12px;
  color: #dc2626;
  background: none;
  border: 1px solid #fca5a5;
  border-radius: 4px;
  padding: 3px 8px;
  cursor: pointer;
}

.btn-delete:hover {
  background: #fef2f2;
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

.modal-message {
  font-size: 14px;
  color: #111827;
  margin: 0 0 20px;
}

.modal-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-danger {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  background: #dc2626;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-danger:disabled {
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

.form-error {
  font-size: 13px;
  color: #dc2626;
  margin: 0 0 8px;
}
</style>
