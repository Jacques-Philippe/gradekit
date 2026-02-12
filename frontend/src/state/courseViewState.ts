import type { AppState } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  COURSE_VIEW_STATE_NAME,
} from "@/types/state";
import { HomeViewState } from "@/state/homeViewState";

export class CourseViewState implements AppState {
  name: string;

  constructor() {
    this.name = COURSE_VIEW_STATE_NAME;
  }

  setup() {
    // any initialization logic for CourseView can go here
  }

  teardown() {
    // any cleanup logic for CourseView can go here
  }

  handleTransition(transition: AppTransition): AppState | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      if (buttonTransition.button === BACK_BUTTON_NAME) {
        return new HomeViewState();
      }
    }
    console.warn(`Unhandled transition ${transition.type} in CourseViewState`);
    // Otherwise no transition, stay in the same state
    return null;
  }
}
