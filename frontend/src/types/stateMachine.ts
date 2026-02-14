import type { AppState, AppTransition } from "@/types/state.ts";
import { createState } from "@/state/stateFactory";

export class StateMachine {
  /** The current application state */
  private currentState: AppState;

  constructor(initialState: AppState) {
    this.currentState = initialState;
    this.currentState.setup();
  }

  getCurrentState(): AppState {
    return this.currentState;
  }

  transition(transition: AppTransition) {
    const stateChange = this.currentState.handleTransition(transition);
    if (stateChange !== null && stateChange.target !== this.currentState.name) {
      try {
        const newState = createState(stateChange);
        this.currentState.teardown();
        this.currentState = newState;
        this.currentState.setup();
      } catch (error) {
        console.error(
          `Failed to transition to state ${stateChange.target}:`,
          error,
        );
        return;
      }
    }
  }
}
