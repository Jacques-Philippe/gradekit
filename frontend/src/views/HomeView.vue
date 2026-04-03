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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { apiGetCourses, type Course } from "@/api/courses";
import { courseRoute } from "@/router/routes";

const router = useRouter();

const query = ref("");
const showResults = ref(false);
const courses = ref<Course[]>([]);

const matchingCourses = computed(() =>
  courses.value.filter((c) =>
    c.name.toLowerCase().includes(query.value.toLowerCase().trim()),
  ),
);

onMounted(async () => {
  const result = await apiGetCourses();
  if (result.ok) courses.value = result.data;
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
</style>
