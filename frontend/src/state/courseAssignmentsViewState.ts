import type {
  AppState,
  AssignmentButtonPressedStateTransition,
  StateChange,
} from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  COURSE_VIEW_STATE_NAME,
  COURSE_ASSIGNMENTS_VIEW_STATE_NAME,
  ASSIGNMENT_BUTTON_PRESSED_TRANSITION,
  ASSIGNMENT_VIEW_STATE_NAME,
} from "@/types/state";

export class CourseAssignmentsViewState implements AppState {
  readonly name: string;

  constructor() {
    this.name = COURSE_ASSIGNMENTS_VIEW_STATE_NAME;
  }

  setup() {}

  teardown() {}

  handleTransition(transition: AppTransition): StateChange | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      if (buttonTransition.button === BACK_BUTTON_NAME) {
        return { target: COURSE_VIEW_STATE_NAME };
      }
    } else if (transition.type === ASSIGNMENT_BUTTON_PRESSED_TRANSITION) {
      const assignmentButtonTransition =
        transition as AssignmentButtonPressedStateTransition;
      return {
        target: ASSIGNMENT_VIEW_STATE_NAME,
        payload: { assignmentId: assignmentButtonTransition.assignmentId },
      };
    }
    console.warn(
      `Unhandled transition ${transition.type} in CourseAssignmentsViewState`,
    );
    // Otherwise no transition, stay in the same state
    return null;
  }
}
