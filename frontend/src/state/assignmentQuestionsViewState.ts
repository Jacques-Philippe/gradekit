import type { AppState, StateChange } from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME,
} from "@/types/state";

export class AssignmentQuestionsViewState implements AppState {
  readonly name: string;

  constructor() {
    this.name = ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME;
  }

  setup() {}

  teardown() {}

  handleTransition(transition: AppTransition): StateChange | null {
    if (transition.type === BUTTON_PRESSED_TRANSITION) {
      const buttonTransition = transition as ButtonPressedStateTransition;
      if (buttonTransition.button === BACK_BUTTON_NAME) {
        // TODO: Determine the appropriate target state for back button
        // This might need to go back to AssignmentView or CourseAssignmentsView
        return null;
      }
    }
    console.warn(
      `Unhandled transition ${transition.type} in AssignmentQuestionsViewState`,
    );
    // Otherwise no transition, stay in the same state
    return null;
  }
}
