import type { AppState, StateChange } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  COURSE_VIEW_STATE_NAME,
  COURSE_STUDENTS_VIEW_STATE_NAME,
} from "@/types/state";

export class CourseStudentsViewState implements AppState {
  readonly name: string;

  constructor() {
    this.name = COURSE_STUDENTS_VIEW_STATE_NAME;
  }

  setup() {}

  teardown() {}

  handleTransition(transition: AppTransition): StateChange | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      if (buttonTransition.button === BACK_BUTTON_NAME) {
        return { target: COURSE_VIEW_STATE_NAME };
      }
    }
    console.warn(
      `Unhandled transition ${transition.type} in CourseStudentsViewState`,
    );
    // Otherwise no transition, stay in the same state
    return null;
  }
}
