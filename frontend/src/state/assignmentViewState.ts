import type { AppState, StateChange } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  EDIT_QUESTION_BUTTON_NAME,
  GRADE_BUTTON_NAME,
  ASSIGNMENT_VIEW_STATE_NAME,
  COURSE_ASSIGNMENTS_VIEW_STATE_NAME,
  GRADE_ASSIGNMENT_VIEW_STATE_NAME,
  ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME,
} from "@/types/state";

export class AssignmentViewState implements AppState {
  readonly name: string;

  constructor() {
    this.name = ASSIGNMENT_VIEW_STATE_NAME;
  }

  setup() {}

  teardown() {}

  handleTransition(transition: AppTransition): StateChange | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      if (buttonTransition.button === BACK_BUTTON_NAME) {
        return { target: COURSE_ASSIGNMENTS_VIEW_STATE_NAME };
      } else if (buttonTransition.button === GRADE_BUTTON_NAME) {
        return { target: GRADE_ASSIGNMENT_VIEW_STATE_NAME };
      } else if (buttonTransition.button === EDIT_QUESTION_BUTTON_NAME) {
        return { target: ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME };
      }
    }
    console.warn(
      `Unhandled transition ${transition.type} in AssignmentViewState`,
    );
    // Otherwise no transition, stay in the same state
    return null;
  }
}
