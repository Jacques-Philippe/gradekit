<template>
  <main>
    <CourseInput />
    <CourseSelector />
  </main>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useCourseStore } from "@/stores/courseStore";

import CourseInput from "@/components/CourseInput.vue";
import CourseSelector from "@/components/CourseSelector.vue";

const router = useRouter();
const courseStore = useCourseStore();

const { currentCourse } = storeToRefs(courseStore);
watch(currentCourse, (course) => {
  if (course) {
    router.push({
      name: "course",
      params: { id: course.id },
    });
  }
});
</script>
