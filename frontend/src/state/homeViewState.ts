import type { AppState } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
} from "@/types/state";

export const HOME_VIEW_STATE_NAME = "HomeView";

export class HomeViewState implements AppState {
  name: string;

  constructor() {
    this.name = HOME_VIEW_STATE_NAME;
  }

  setup() {
    // any initialization logic for HomeView can go here
  }

  teardown() {
    // any cleanup logic for HomeView can go here
  }

  handleTransition(transition: AppTransition): AppState | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      console.log(`Button ${buttonTransition.button} was pressed in HomeView`);
      // Here you could return a different state based on the button pressed
      // For example:
    }
    console.warn(`Unhandled transition ${transition.type} in HomeViewState`);
    // Otherwise no transition, stay in the same state
    return null;
  }
}
