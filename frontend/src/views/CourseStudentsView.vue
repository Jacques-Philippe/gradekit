<template>
  <div class="course-students-page">
    <button class="btn-back" @click="router.back()" data-testid="back-btn">
      {{ t("course_students.back") }}
    </button>

    <h1 class="page-title" data-testid="page-title">
      {{ t("course_students.title") }}
    </h1>

    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'manual' }"
        @click="activeTab = 'manual'"
        data-testid="tab-manual"
      >
        {{ t("course_students.tab_manual") }}
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'import' }"
        @click="activeTab = 'import'"
        data-testid="tab-import"
      >
        {{ t("course_students.tab_import") }}
      </button>
    </div>

    <!-- Manual tab -->
    <section
      v-if="activeTab === 'manual'"
      class="tab-panel"
      data-testid="panel-manual"
    >
      <form
        class="add-form"
        @submit.prevent="submitAddStudent"
        data-testid="add-student-form"
      >
        <input
          v-model="manualName"
          type="text"
          class="text-input"
          :placeholder="t('course_students.name_placeholder')"
          data-testid="manual-name-input"
        />
        <button
          type="submit"
          class="btn-primary"
          :disabled="addPending"
          data-testid="add-student-submit"
        >
          {{ t("course_students.add") }}
        </button>
      </form>
      <p v-if="addError" class="form-error" data-testid="add-student-error">
        {{ addError }}
      </p>
    </section>

    <!-- Import tab -->
    <section
      v-if="activeTab === 'import'"
      class="tab-panel"
      data-testid="panel-import"
    >
      <div v-if="!importPreview.length" class="import-upload">
        <p class="import-hint">
          {{ t("course_students.csv_hint_prefix") }}<code>full_name</code
          >{{ t("course_students.csv_hint_suffix") }}
        </p>
        <input
          type="file"
          accept=".csv"
          class="file-input"
          @change="onFileSelected"
          data-testid="csv-file-input"
        />
        <p v-if="parseError" class="form-error" data-testid="parse-error">
          {{ parseError }}
        </p>
      </div>
      <div v-else class="import-preview">
        <p class="preview-label" data-testid="preview-label">
          {{
            t("course_students.preview_label", importPreview.length, {
              named: { count: importPreview.length },
            })
          }}
        </p>
        <ul class="preview-list" data-testid="preview-list">
          <li
            v-for="(name, i) in importPreview"
            :key="i"
            class="preview-item"
            :data-testid="`preview-row-${i}`"
          >
            {{ name }}
          </li>
        </ul>
        <div class="preview-actions">
          <button
            class="btn-primary"
            :disabled="importPending"
            @click="confirmImport"
            data-testid="confirm-import-btn"
          >
            {{ t("course_students.confirm_import") }}
          </button>
          <button
            class="btn-cancel"
            @click="cancelImport"
            data-testid="cancel-import-btn"
          >
            {{ t("course_students.cancel") }}
          </button>
        </div>
        <p v-if="importError" class="form-error" data-testid="import-error">
          {{ importError }}
        </p>
      </div>
      <div
        v-if="importResult"
        class="import-result"
        data-testid="import-result"
      >
        <p class="result-success">
          {{
            t("course_students.import_success", importResult.created.length, {
              named: { count: importResult.created.length },
            })
          }}
        </p>
        <p
          v-if="importResult.errors.length"
          class="result-errors"
          data-testid="import-result-errors"
        >
          {{
            t("course_students.import_skipped", importResult.errors.length, {
              named: { count: importResult.errors.length },
            })
          }}
        </p>
      </div>
    </section>

    <!-- Enrolled student list -->
    <section class="enrolled-section">
      <h2 class="section-heading">
        {{ t("course_students.enrolled_heading") }}
      </h2>
      <ul
        v-if="students.length"
        class="student-list"
        data-testid="student-list"
      >
        <li
          v-for="student in students"
          :key="student.id"
          class="student-row"
          :data-testid="`student-row-${student.id}`"
        >
          <span class="student-name">{{ student.full_name }}</span>
          <button
            class="btn-remove"
            :disabled="removingId === student.id"
            @click="confirmingStudent = student"
            :data-testid="`remove-student-${student.id}`"
          >
            {{ t("course_students.remove") }}
          </button>
        </li>
      </ul>
      <p v-else class="empty-state" data-testid="students-empty">
        {{ t("course_students.no_students") }}
      </p>
    </section>
    <!-- Remove confirmation modal -->
    <div
      v-if="confirmingStudent"
      class="modal-backdrop"
      data-testid="remove-modal"
      @click.self="confirmingStudent = null"
    >
      <div class="modal">
        <p class="modal-message">
          {{
            t("course_students.remove_confirm", {
              name: confirmingStudent.full_name,
            })
          }}
        </p>
        <p v-if="removeError" class="form-error" data-testid="remove-error">
          {{ removeError }}
        </p>
        <div class="modal-actions">
          <button
            class="btn-danger"
            :disabled="removingId !== null"
            @click="confirmRemove"
            data-testid="confirm-remove-btn"
          >
            {{ t("course_students.remove") }}
          </button>
          <button
            class="btn-cancel"
            @click="confirmingStudent = null"
            data-testid="cancel-remove-btn"
          >
            {{ t("course_students.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  apiGetStudents,
  apiAddStudent,
  apiImportStudents,
  apiDeleteStudent,
  type Student,
  type ImportResult,
} from "@/api/students";
import { localizeError } from "@/utils/localizeError";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const courseId = Number(route.params.id);
const activeTab = ref<"manual" | "import">(
  route.query.tab === "import" ? "import" : "manual",
);

const students = ref<Student[]>([]);

// Manual add
const manualName = ref("");
const addPending = ref(false);
const addError = ref("");

// Import
const pendingFile = ref<File | null>(null);
const importPreview = ref<string[]>([]);
const parseError = ref("");
const importPending = ref(false);
const importError = ref("");
const importResult = ref<ImportResult | null>(null);

// Remove
const confirmingStudent = ref<Student | null>(null);
const removingId = ref<number | null>(null);
const removeError = ref("");

onMounted(async () => {
  const result = await apiGetStudents(courseId);
  if (result.ok) students.value = result.data;
});

async function submitAddStudent() {
  const name = manualName.value.trim();
  if (!name) return;
  addPending.value = true;
  addError.value = "";
  const result = await apiAddStudent(courseId, name);
  addPending.value = false;
  if (!result.ok) {
    addError.value = localizeError(result.error);
    return;
  }
  students.value = [...students.value, result.data];
  manualName.value = "";
}

function parseCsv(text: string): string[] | null {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return null;
  const headers = lines[0]!.split(",").map((h) => h.trim().toLowerCase());
  const col = headers.indexOf("full_name");
  if (col === -1) return null;
  return lines
    .slice(1)
    .map((l) => l.split(",")[col]?.trim() ?? "")
    .filter((n) => n.length > 0);
}

function onFileSelected(event: Event) {
  parseError.value = "";
  importResult.value = null;
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  pendingFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const names = parseCsv(text);
    if (names === null) {
      parseError.value = t("course_students.parse_error_no_column");
      importPreview.value = [];
      pendingFile.value = null;
      return;
    }
    if (!names.length) {
      parseError.value = t("course_students.parse_error_no_rows");
      importPreview.value = [];
      pendingFile.value = null;
      return;
    }
    importPreview.value = names;
  };
  reader.readAsText(file);
}

function cancelImport() {
  importPreview.value = [];
  pendingFile.value = null;
  parseError.value = "";
  importError.value = "";
}

async function confirmImport() {
  if (!pendingFile.value) return;
  importPending.value = true;
  importError.value = "";
  const result = await apiImportStudents(courseId, pendingFile.value);
  importPending.value = false;
  if (!result.ok) {
    importError.value = localizeError(result.error);
    return;
  }
  importResult.value = result.data;
  students.value = [...students.value, ...result.data.created];
  importPreview.value = [];
  pendingFile.value = null;
}

async function confirmRemove() {
  if (!confirmingStudent.value) return;
  const studentId = confirmingStudent.value.id;
  removingId.value = studentId;
  removeError.value = "";
  const result = await apiDeleteStudent(courseId, studentId);
  removingId.value = null;
  if (!result.ok) {
    removeError.value = localizeError(result.error);
    return;
  }
  students.value = students.value.filter((s) => s.id !== studentId);
  confirmingStudent.value = null;
}
</script>

<style scoped>
.course-students-page {
  padding: 32px;
  max-width: 700px;
  margin: 0 auto;
}

.btn-back {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  display: block;
}

.btn-back:hover {
  color: #1a2844;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a2844;
  margin: 0 0 24px;
}

.tab-bar {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
}

.tab-btn.active {
  color: #1a2844;
  border-bottom-color: #1a2844;
}

.tab-panel {
  margin-bottom: 32px;
}

.add-form {
  display: flex;
  gap: 8px;
}

.text-input {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
}

.text-input:focus {
  border-color: #1a2844;
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

.form-error {
  font-size: 13px;
  color: #dc2626;
  margin: 8px 0 0;
}

.import-hint {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 10px;
}

.file-input {
  display: block;
}

.preview-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px;
}

.preview-list {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  max-height: 220px;
  overflow-y: auto;
}

.preview-item {
  padding: 7px 12px;
  font-size: 13px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.import-result {
  margin-top: 12px;
  font-size: 13px;
}

.result-success {
  color: #16a34a;
  margin: 0 0 4px;
}

.result-errors {
  color: #dc2626;
  margin: 0;
}

.enrolled-section {
  margin-top: 8px;
}

.section-heading {
  font-size: 14px;
  font-weight: 600;
  color: #1a2844;
  margin: 0 0 12px;
}

.student-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.student-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.student-name {
  color: #111827;
}

.btn-remove {
  font-size: 12px;
  color: #dc2626;
  background: none;
  border: 1px solid #fca5a5;
  border-radius: 4px;
  padding: 3px 8px;
  cursor: pointer;
}

.btn-remove:hover {
  background: #fef2f2;
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
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
  width: 340px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
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
</style>
