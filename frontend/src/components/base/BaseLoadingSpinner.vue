<template>
  <div
    class="spinner"
    :style="{
      width: props.size + 'px',
      height: props.size + 'px',
      borderWidth: props.thickness + 'px',
    }"
    role="status"
    aria-live="polite"
    aria-label="Loading"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number;
    thickness?: number;
  }>(),
  {
    size: 32,
    thickness: 4,
  },
);
</script>

<style scoped>
.spinner {
  border-style: solid;
  border-color: #e5e7eb;
  border-top-color: #3b82f6;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
