<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
  type: "button",
});

const classes = computed(() => [
  "base-button",
  `base-button--${props.variant}`,
  { "base-button--disabled": props.disabled },
]);
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

/* Primary */
.base-button--primary {
  background-color: #2563eb;
  color: white;
}

.base-button--primary:hover {
  background-color: #1d4ed8;
}

/* Secondary */
.base-button--secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.base-button--secondary:hover {
  background-color: #d1d5db;
}

/* Danger */
.base-button--danger {
  background-color: #dc2626;
  color: white;
}

.base-button--danger:hover {
  background-color: #b91c1c;
}

/* Disabled */
.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
