import type {
  AppState,
  QuestionButtonPressedStateTransition,
  StateChange,
} from "@/types/state";
import {
  AppTransition,
  BUTTON_PRESSED_TRANSITION,
  ButtonPressedStateTransition,
  BACK_BUTTON_NAME,
  ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME,
  ASSIGNMENT_VIEW_STATE_NAME,
  QUESTION_BUTTON_PRESSED_TRANSITION,
  QUESTION_VIEW_STATE_NAME,
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
        return { target: ASSIGNMENT_VIEW_STATE_NAME };
      }
    } else if (transition.type === QUESTION_BUTTON_PRESSED_TRANSITION) {
      const questionButtonTransition =
        transition as QuestionButtonPressedStateTransition;
      return {
        target: QUESTION_VIEW_STATE_NAME,
        payload: { questionId: questionButtonTransition.questionId },
      };
    }
    console.warn(
      `Unhandled transition ${transition.type} in AssignmentQuestionsViewState`,
    );
    // Otherwise no transition, stay in the same state
    return null;
  }
}
