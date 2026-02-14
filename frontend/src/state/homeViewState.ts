import type { AppState, StateChange } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  COURSE_BUTTON_NAME,
  HOME_VIEW_STATE_NAME,
  COURSE_VIEW_STATE_NAME,
} from "@/types/state";

export class HomeViewState implements AppState {
  readonly name: string;

  constructor() {
    this.name = HOME_VIEW_STATE_NAME;
  }

  setup() {
    // any initialization logic for HomeView can go here
  }

  teardown() {
    // any cleanup logic for HomeView can go here
  }

  handleTransition(transition: AppTransition): StateChange | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      if (buttonTransition.button === COURSE_BUTTON_NAME) {
        return { target: COURSE_VIEW_STATE_NAME };
      }
    }
    console.warn(`Unhandled transition ${transition.type} in HomeViewState`);
    // Otherwise no transition, stay in the same state
    return null;
  }
}
