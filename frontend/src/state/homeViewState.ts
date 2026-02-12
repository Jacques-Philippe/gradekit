import type { AppState } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  COURSE_BUTTON_NAME,
  HOME_VIEW_STATE_NAME,
} from "@/types/state";

import { CourseViewState } from "@/state/courseViewState";

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
      if (buttonTransition.button === COURSE_BUTTON_NAME) {
        return new CourseViewState();
      }
    }
    console.warn(`Unhandled transition ${transition.type} in HomeViewState`);
    // Otherwise no transition, stay in the same state
    return null;
  }
}
