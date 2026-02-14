<template>
  <div class="course-assignments-view">
    <!-- Navigation bar -->
    <nav class="nav-bar">
      <BaseButton @click="goBack" aria-label="Back to course view">
        <BackIcon />
      </BaseButton>
    </nav>

    <!-- Page content -->
    <main>
      <div>Course Assignments View</div>
      <!-- Assignment creation input -->
      <!-- Assignments list, with deletion element -->
    </main>
  </div>
</template>

<script setup lang="ts">
import BackIcon from "@/assets/Chevron_Left_MD.svg";
import BaseButton from "@/components/base/BaseButton.vue";
import { useAppStore } from "@/stores/appStore";
import { ButtonPressedStateTransition, BACK_BUTTON_NAME } from "@/types/state";

const appStore = useAppStore();

function goBack() {
  appStore.transition(new ButtonPressedStateTransition(BACK_BUTTON_NAME));
}
</script>
