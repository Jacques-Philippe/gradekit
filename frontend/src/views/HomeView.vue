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
      <h2 class="section-heading">Recently worked on</h2>
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { apiGetCourses, type Course } from "@/api/courses";
import { apiGetActivity } from "@/api/activity";
import { courseRoute } from "@/router/routes";

const router = useRouter();

const query = ref("");
const showResults = ref(false);
const courses = ref<Course[]>([]);
const recentCourses = ref<Course[]>([]);

const matchingCourses = computed(() =>
  courses.value.filter((c) =>
    c.name.toLowerCase().includes(query.value.toLowerCase().trim()),
  ),
);

onMounted(async () => {
  const [coursesResult, activityResult] = await Promise.all([
    apiGetCourses(),
    apiGetActivity(),
  ]);
  if (coursesResult.ok) courses.value = coursesResult.data;
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

function navigateToCourse(id: number) {
  query.value = "";
  showResults.value = false;
  router.push(courseRoute(id));
}

function onFocusOut() {
  showResults.value = false;
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
</style>
