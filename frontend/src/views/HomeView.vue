<template>
  <div class="home-page">
    <div class="search-wrapper">
      <input
        class="search-input"
        type="text"
        placeholder="Search courses and assignments…"
        v-model="query"
        @focus="showResults = true"
        @blur="onFocusOut"
        data-testid="search-input"
      />
      <div
        v-if="showResults && query.trim()"
        class="search-results"
        data-testid="search-results"
      >
        <div class="result-group">
          <p class="group-label">Courses</p>
          <template v-if="matchingCourses.length">
            <button
              v-for="course in matchingCourses"
              :key="course.id"
              class="result-item"
              @mousedown.prevent="navigateToCourse(course.id)"
              :data-testid="`result-course-${course.id}`"
            >
              {{ course.name }}
            </button>
          </template>
          <p v-else class="no-results">No courses found</p>
        </div>
        <div class="result-group">
          <p class="group-label">Assignments</p>
          <p class="no-results">No assignments found</p>
        </div>
      </div>
    </div>
    <section class="recent-section">
      <div class="section-header">
        <h2 class="section-heading">Recently worked on</h2>
        <button
          v-if="!showCreateForm"
          class="btn-create"
          @click="showCreateForm = true"
          data-testid="open-create-course"
        >
          + New Course
        </button>
      </div>
      <form
        v-if="showCreateForm"
        class="create-form"
        @submit.prevent="submitCreateCourse"
        data-testid="create-course-form"
      >
        <input
          v-model="newCourseName"
          class="create-input"
          type="text"
          placeholder="Course name"
          autofocus
          data-testid="create-course-input"
        />
        <button
          type="submit"
          class="btn-primary"
          :disabled="createPending"
          data-testid="create-course-submit"
        >
          Create
        </button>
        <button
          type="button"
          class="btn-cancel"
          @click="cancelCreate"
          data-testid="create-course-cancel"
        >
          Cancel
        </button>
        <p
          v-if="createError"
          class="form-error"
          data-testid="create-course-error"
        >
          {{ createError }}
        </p>
      </form>
      <div v-if="recentCourses.length" class="course-cards">
        <button
          v-for="course in recentCourses"
          :key="course.id"
          class="course-card"
          @click="navigateToCourse(course.id)"
          :data-testid="`recent-course-${course.id}`"
        >
          {{ course.name }}
        </button>
      </div>
      <p v-else class="empty-state">No recent activity yet.</p>
    </section>

    <section class="recent-section">
      <h2 class="section-heading">Incoming deadlines</h2>
      <ul
        v-if="deadlines.length"
        class="deadline-list"
        data-testid="deadlines-list"
      >
        <li
          v-for="d in deadlines"
          :key="d.assignment_id"
          class="deadline-item"
          :class="{ 'deadline-urgent': isUrgent(d.due_date) }"
          :data-testid="`deadline-${d.assignment_id}`"
        >
          <span class="deadline-title">{{ d.assignment_title }}</span>
          <span class="deadline-course">{{ d.course_name }}</span>
          <span
            class="deadline-date"
            :class="{ 'deadline-date-urgent': isUrgent(d.due_date) }"
            >{{ formatDueDate(d.due_date) }}</span
          >
        </li>
      </ul>
      <p v-else class="empty-state" data-testid="deadlines-empty">
        No upcoming deadlines.
      </p>
    </section>

    <section class="recent-section">
      <h2 class="section-heading">Recent activity</h2>
      <ul
        v-if="activityFeed.length"
        class="activity-list"
        data-testid="activity-feed"
      >
        <li
          v-for="event in activityFeed"
          :key="event.id"
          class="activity-item"
          :data-testid="`activity-event-${event.id}`"
        >
          <span class="activity-message">{{ formatEventMessage(event) }}</span>
          <span class="activity-time">{{
            relativeTime(event.created_at)
          }}</span>
        </li>
      </ul>
      <p v-else class="empty-state" data-testid="activity-empty">
        No activity yet.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { apiGetCourses, apiCreateCourse, type Course } from "@/api/courses";
import { apiGetActivity, type ActivityEvent } from "@/api/activity";
import { apiGetDeadlines, type Deadline } from "@/api/deadlines";
import { courseRoute } from "@/router/routes";

const router = useRouter();

const query = ref("");
const showResults = ref(false);
const courses = ref<Course[]>([]);
const recentCourses = ref<Course[]>([]);
const activityFeed = ref<ActivityEvent[]>([]);
const deadlines = ref<Deadline[]>([]);
const showCreateForm = ref(false);
const newCourseName = ref("");
const createPending = ref(false);
const createError = ref("");

const matchingCourses = computed(() =>
  courses.value.filter((c) =>
    c.name.toLowerCase().includes(query.value.toLowerCase().trim()),
  ),
);

onMounted(async () => {
  const [coursesResult, activityResult, deadlinesResult] = await Promise.all([
    apiGetCourses(),
    apiGetActivity(),
    apiGetDeadlines(),
  ]);
  if (deadlinesResult.ok) deadlines.value = deadlinesResult.data;
  if (coursesResult.ok) courses.value = coursesResult.data;
  if (activityResult.ok) activityFeed.value = activityResult.data;
  if (coursesResult.ok && activityResult.ok) {
    const courseMap = new Map(coursesResult.data.map((c) => [c.id, c]));
    const latestByCourse = new Map<number, string>();
    for (const event of activityResult.data) {
      const payload = JSON.parse(event.payload) as { course_id?: number };
      const courseId = payload.course_id;
      if (courseId !== undefined && !latestByCourse.has(courseId)) {
        latestByCourse.set(courseId, event.created_at);
      }
    }
    recentCourses.value = [...latestByCourse.keys()]
      .filter((id) => courseMap.has(id))
      .sort((a, b) => {
        const ta = latestByCourse.get(a)!;
        const tb = latestByCourse.get(b)!;
        return tb.localeCompare(ta);
      })
      .slice(0, 5)
      .map((id) => courseMap.get(id)!);
  }
});

function isUrgent(isoString: string): boolean {
  return new Date(isoString).getTime() - Date.now() <= 24 * 60 * 60 * 1000;
}

function formatDueDate(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function relativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function formatEventMessage(event: ActivityEvent): string {
  const p = JSON.parse(event.payload) as Record<string, unknown>;
  switch (event.event_type) {
    case "COURSE_CREATED":
      return `Created course "${p.course_name}"`;
    case "STUDENT_ADDED":
      return `Added ${p.student_name} to ${p.course_name}`;
    case "STUDENT_REMOVED":
      return `Removed ${p.student_name} from ${p.course_name}`;
    case "STUDENTS_IMPORTED": {
      const count = (p.students as unknown[]).length;
      return `Imported ${count} student${count === 1 ? "" : "s"} into ${p.course_name}`;
    }
    default:
      return event.event_type;
  }
}

function navigateToCourse(id: number) {
  query.value = "";
  showResults.value = false;
  router.push(courseRoute(id));
}

function onFocusOut() {
  showResults.value = false;
}

function cancelCreate() {
  showCreateForm.value = false;
  newCourseName.value = "";
  createError.value = "";
}

async function submitCreateCourse() {
  const name = newCourseName.value.trim();
  if (!name) return;
  createPending.value = true;
  createError.value = "";
  const result = await apiCreateCourse(name);
  createPending.value = false;
  if (!result.ok) {
    createError.value = result.error;
    return;
  }
  courses.value = [...courses.value, result.data];
  recentCourses.value = [result.data, ...recentCourses.value].slice(0, 5);
  cancelCreate();
}
</script>

<style scoped>
.home-page {
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  background: #ffffff;
}

.search-input:focus {
  border-color: #1a2844;
  box-shadow: 0 0 0 3px rgba(26, 40, 68, 0.08);
}

.search-results {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
}

.result-group {
  padding: 8px 0;
}

.result-group + .result-group {
  border-top: 1px solid #e5e7eb;
}

.group-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  padding: 4px 14px 6px;
  margin: 0;
}

.result-item {
  display: block;
  width: 100%;
  padding: 9px 14px;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
}

.result-item:hover {
  background: #f5f6f8;
}

.no-results {
  padding: 6px 14px;
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.recent-section {
  margin-top: 32px;
}

.section-heading {
  font-size: 14px;
  font-weight: 600;
  color: #1a2844;
  margin: 0 0 12px;
}

.course-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.course-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  text-align: left;
  min-width: 160px;
  transition: box-shadow 0.15s;
}

.course-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-state {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-header .section-heading {
  margin-bottom: 0;
}

.btn-create {
  font-size: 13px;
  font-weight: 500;
  color: #1a2844;
  background: transparent;
  border: 1px solid #1a2844;
  border-radius: 6px;
  padding: 5px 12px;
  cursor: pointer;
}

.btn-create:hover {
  background: #f5f6f8;
}

.create-form {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.create-input {
  flex: 1;
  min-width: 180px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
}

.create-input:focus {
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
  width: 100%;
  font-size: 13px;
  color: #dc2626;
  margin: 0;
}

.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.activity-message {
  color: #111827;
}

.activity-time {
  color: #9ca3af;
  white-space: nowrap;
  flex-shrink: 0;
}

.deadline-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.deadline-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.deadline-title {
  font-weight: 500;
  color: #111827;
  flex: 1;
}

.deadline-course {
  color: #6b7280;
  white-space: nowrap;
}

.deadline-date {
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
}

.deadline-date-urgent {
  color: #dc2626;
  font-weight: 500;
}
</style>
