import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";
import { StateMachine } from "@/types/stateMachine";
import { HomeViewState } from "@/state/homeViewState";
import type { AppTransition } from "@/types/state";

export const useAppStore = defineStore("app", () => {
  const machine = new StateMachine(new HomeViewState());

  const activeCourseId = shallowRef<string | null>(null);

  // This is the reactive bridge
  const stateRef = shallowRef(machine.getCurrentState());

  function transition(t: AppTransition) {
    machine.transition(t);

    // Force reactivity update
    stateRef.value = machine.getCurrentState();
  }

  function setActiveCourse(id: string | null) {
    activeCourseId.value = id;
  }

  const currentState = computed(() => stateRef.value);

  return {
    currentState,
    transition,
    activeCourseId,
    setActiveCourse,
  };
});
