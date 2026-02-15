import type { AppState, StateChange } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  COURSE_VIEW_STATE_NAME,
  HOME_VIEW_STATE_NAME,
  ASSIGNMENTS_BUTTON_NAME,
  STUDENTS_BUTTON_NAME,
  COURSE_ASSIGNMENTS_VIEW_STATE_NAME,
  COURSE_STUDENTS_VIEW_STATE_NAME,
} from "@/types/state";

export class CourseViewState implements AppState {
  readonly name: string;

  constructor() {
    this.name = COURSE_VIEW_STATE_NAME;
  }

  setup() {
    // any initialization logic for CourseView can go here
  }

  teardown() {
    // any cleanup logic for CourseView can go here
  }

  handleTransition(transition: AppTransition): StateChange | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      if (buttonTransition.button === BACK_BUTTON_NAME) {
        return { target: HOME_VIEW_STATE_NAME };
      } else if (buttonTransition.button === ASSIGNMENTS_BUTTON_NAME) {
        return { target: COURSE_ASSIGNMENTS_VIEW_STATE_NAME };
      } else if (buttonTransition.button === STUDENTS_BUTTON_NAME) {
        return { target: COURSE_STUDENTS_VIEW_STATE_NAME };
      }
    }
    console.warn(`Unhandled transition ${transition.type} in CourseViewState`);
    // Otherwise no transition, stay in the same state
    return null;
  }
}
