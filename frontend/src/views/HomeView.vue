<template>
  <div class="home-page">
    <div class="search-wrapper" @focusout="onFocusOut">
      <input
        class="search-input"
        type="text"
        :placeholder="t('home.search_placeholder')"
        v-model="query"
        @focus="showResults = true"
        data-testid="search-input"
      />
      <div
        v-if="showResults && query.trim()"
        class="search-results"
        data-testid="search-results"
      >
        <div class="result-group">
          <p class="group-label">{{ t("home.search_courses") }}</p>
          <template v-if="matchingCourses.length">
            <button
              v-for="course in matchingCourses"
              :key="course.id"
              class="result-item"
              @click="navigateToCourse(course.id)"
              :data-testid="`result-course-${course.id}`"
            >
              {{ course.name }}
            </button>
          </template>
          <p v-else class="no-results">{{ t("home.no_courses_found") }}</p>
        </div>
        <div class="result-group">
          <p class="group-label">{{ t("home.search_assignments") }}</p>
          <p class="no-results">{{ t("home.no_assignments_found") }}</p>
        </div>
      </div>
    </div>

    <section class="recent-section">
      <h2 class="section-heading">{{ t("home.recently_worked_on") }}</h2>
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
      <p v-else class="empty-state">{{ t("home.no_recent_activity") }}</p>
    </section>

    <section class="recent-section">
      <h2 class="section-heading">{{ t("home.incoming_deadlines") }}</h2>
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
        {{ t("home.no_deadlines") }}
      </p>
    </section>

    <section class="recent-section">
      <h2 class="section-heading">{{ t("home.recent_activity") }}</h2>
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
        {{ t("home.no_activity") }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { apiGetCourses, type Course } from "@/api/courses";
import { apiGetActivity, type ActivityEvent } from "@/api/activity";
import { apiGetDeadlines, type Deadline } from "@/api/deadlines";
import { courseRoute } from "@/router/routes";

const { t, locale } = useI18n();
const router = useRouter();

const query = ref("");
const showResults = ref(false);
const courses = ref<Course[]>([]);
const recentCourses = ref<Course[]>([]);
const activityFeed = ref<ActivityEvent[]>([]);
const deadlines = ref<Deadline[]>([]);

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
  return new Date(isoString).toLocaleString(locale.value, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function relativeTime(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return t("home.time_just_now");
  if (diffMins < 60) return t("home.time_minutes_ago", diffMins);
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t("home.time_hours_ago", diffHours);
  const diffDays = Math.floor(diffHours / 24);
  return t("home.time_days_ago", diffDays);
}

function formatEventMessage(event: ActivityEvent): string {
  const p = JSON.parse(event.payload) as Record<string, unknown>;
  switch (event.event_type) {
    case "COURSE_CREATED":
      return t("home.activity_course_created", { name: p.course_name });
    case "STUDENT_ADDED":
      return t("home.activity_student_added", {
        student: p.student_name,
        course: p.course_name,
      });
    case "STUDENT_REMOVED":
      return t("home.activity_student_removed", {
        student: p.student_name,
        course: p.course_name,
      });
    case "STUDENTS_IMPORTED": {
      const count = (p.students as unknown[]).length;
      return t("home.activity_students_imported", count, {
        named: { count, course: p.course_name },
      });
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

function onFocusOut(event: FocusEvent) {
  const wrapper = event.currentTarget as HTMLElement;
  if (!wrapper.contains(event.relatedTarget as Node)) {
    showResults.value = false;
  }
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
