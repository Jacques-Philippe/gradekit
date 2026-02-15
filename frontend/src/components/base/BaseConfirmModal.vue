<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="overlay" @click.self="onCancel">
        <Transition name="scale">
          <div class="modal" role="dialog" aria-modal="true">
            <header class="modal-header">
              <h3>{{ title }}</h3>
            </header>

            <section class="modal-body">
              <slot>
                {{ message }}
              </slot>
            </section>

            <footer class="modal-footer">
              <BaseButton variant="secondary" @click="onCancel">
                {{ cancelText }}
              </BaseButton>

              <BaseButton variant="danger" @click="onConfirm">
                {{ confirmText }}
              </BaseButton>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import BaseButton from "./BaseButton.vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
  }>(),
  {
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Confirm",
    cancelText: "Cancel",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

function onConfirm() {
  emit("confirm");
  emit("update:modelValue", false);
}

function onCancel() {
  emit("cancel");
  emit("update:modelValue", false);
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.modelValue) {
    onCancel();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.4);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}

/* Modal */
.modal {
  background: white;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  padding: 1.5rem;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal-header h3 {
  margin: 0 0 1rem 0;
}

.modal-body {
  margin-bottom: 1.5rem;
  color: #374151;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
