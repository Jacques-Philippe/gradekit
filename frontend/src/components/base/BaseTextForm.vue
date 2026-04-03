<script setup lang="ts">
import { ref, computed } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";

interface Props {
  label?: string;
  placeholder?: string;
  buttonText?: string;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  placeholder: "",
  buttonText: "Submit",
  loading: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "submit", value: string): void;
}>();

const inputValue = ref("");

const isDisabled = computed(
  () => props.disabled || props.loading || !inputValue.value.trim(),
);

function handleSubmit() {
  if (isDisabled.value) return;

  emit("submit", inputValue.value.trim());
}

function reset() {
  inputValue.value = "";
}

defineExpose({ reset });
</script>

<template>
  <form class="base-form" @submit.prevent="handleSubmit">
    <label v-if="label" class="base-form__label">
      {{ label }}
    </label>

    <div class="base-form__controls">
      <input
        v-model="inputValue"
        type="text"
        class="base-form__input"
        :placeholder="placeholder"
        :disabled="loading || disabled"
      />

      <BaseButton type="submit" :disabled="isDisabled">
        <span v-if="loading">Loading...</span>
        <span v-else>{{ buttonText }}</span>
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.base-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-form__label {
  font-weight: 500;
}

.base-form__controls {
  display: flex;
  gap: 0.5rem;
}

.base-form__input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

.base-form__input:focus {
  outline: none;
  border-color: #2563eb;
}

.base-form__input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
