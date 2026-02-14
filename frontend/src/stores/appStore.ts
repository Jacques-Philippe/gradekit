// stores/appStore.ts
import { defineStore } from "pinia";
import { computed, shallowRef } from "vue";
import { StateMachine } from "@/types/state";
import { HomeViewState } from "@/state/homeViewState";
import type { AppTransition } from "@/types/state";

export const useAppStore = defineStore("app", () => {
  const machine = new StateMachine(new HomeViewState());

  // This is the reactive bridge
  const stateRef = shallowRef(machine.getCurrentState());

  function transition(t: AppTransition) {
    machine.transition(t);

    // Force reactivity update
    stateRef.value = machine.getCurrentState();
  }

  const currentState = computed(() => stateRef.value);

  return {
    currentState,
    transition,
  };
});
