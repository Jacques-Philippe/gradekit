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

      <p v-if="!courseStore.currentCourse" id="no-course-selected-warning">
        No course selected
      </p>
      <h1 v-else>{{ courseStore.currentCourse.name }}</h1>
    </nav>

    <!-- Page content -->
    <main>
      <!-- rest of your course UI -->
    </main>
  </div>
</template>

<script setup lang="ts">
import HouseIcon from "@/assets/House_01.svg";
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStore } from "@/stores/courseStore";

const router = useRouter();
const route = useRoute();
const courseStore = useCourseStore();

async function loadCourse() {
  const id = route.params.id as string;
  await courseStore.selectCourse(id);
}

onMounted(loadCourse);

// Handle route param changes (rare but correct)
watch(() => route.params.id, loadCourse);

function goHome() {
  router.push("/");
}
</script>
