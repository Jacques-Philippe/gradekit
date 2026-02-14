<template>
  <li class="base-list-row">
    <div class="row-content">
      <slot />
    </div>

    <div v-if="$slots.actions" class="row-actions">
      <slot name="actions" />
    </div>
  </li>
</template>

<script setup lang="ts">
// purely presentational
</script>

<style scoped>
.base-list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0.75rem 1rem;
  border-radius: 8px;

  background-color: var(--row-bg, #2563eb);
  color: white;
  border: 1px solid #e5e7eb;

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.base-list-row:hover {
  background-color: #1d4ed8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.row-content {
  flex: 1;
  font-weight: 500;
}

.row-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
