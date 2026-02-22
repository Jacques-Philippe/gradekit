import type { AppState, StateChange } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  GRADE_ASSIGNMENT_VIEW_STATE_NAME,
} from "@/types/state";

export class GradeAssignmentViewState implements AppState {
  readonly name: string;

  constructor() {
    this.name = GRADE_ASSIGNMENT_VIEW_STATE_NAME;
  }

  setup() {}

  teardown() {}

  handleTransition(transition: AppTransition): StateChange | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      if (buttonTransition.button === BACK_BUTTON_NAME) {
        // TODO: Determine the appropriate target state for back button
        // This might need to go back to AssignmentView or AssignmentQuestionsView
        return null;
      }
    }
    console.warn(
      `Unhandled transition ${transition.type} in GradeAssignmentViewState`,
    );
    // Otherwise no transition, stay in the same state
    return null;
  }
}
