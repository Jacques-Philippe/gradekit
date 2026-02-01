<template>
  <div class="course-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <button
        class="icon-button"
        @click="goHome"
        aria-label="Back to course selection"
      >
        <HouseIcon />
      </button>

      <p v-if="!course" id="no-course-selected-warning">No course selected</p>
      <h1 v-else>{{ course.name }}</h1>
    </nav>

    <!-- Page content -->
    <main>
      <!-- rest of your course UI -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCourseStore } from "@/stores/courseStore";
import HouseIcon from "@/assets/House_01.svg";

const router = useRouter();
const store = useCourseStore();

const course = computed(() => store.currentCourse);

function goHome() {
  router.push("/");
}
</script>
