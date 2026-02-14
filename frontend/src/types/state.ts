import { createState } from "@/state/stateFactory";

export class AppTransition {
  /** The transition type */
  readonly type: string;

  constructor(type: string) {
    this.type = type;
  }
}

export interface StateChange {
  target: string;
  payload?: unknown;
}

export interface AppState {
  /** A unique name for the state, used for debugging and logging */
  readonly name: string;
  setup(): void;
  teardown(): void;
  /** Returns the name of the new state to transition to, or null to stay in the same state */
  handleTransition(transition: AppTransition): StateChange | null;
}

export class StateMachine {
  /** The current application state */
  private currentState: AppState;

  constructor(initialState: AppState) {
    this.currentState = initialState;
    this.currentState.setup();
  }

  getCurrentState(): AppState {
    return this.currentState;
  }

  transition(transition: AppTransition) {
    const stateChange = this.currentState.handleTransition(transition);
    if (stateChange !== null && stateChange.target !== this.currentState.name) {
      this.currentState.teardown();
      this.currentState = createState(stateChange);
      this.currentState.setup();
    }
  }
}
// Form names
export const NEW_COURSE_FORM_NAME = "NewCourseForm";

// Button names
export const BACK_BUTTON_NAME = "BackButton";
export const COURSE_BUTTON_NAME = "CourseButton";

// State names
export const HOME_VIEW_STATE_NAME = "HomeView";
export const COURSE_VIEW_STATE_NAME = "CourseView";

/** A unique name for the transition where a button is pressed */
export const BUTTON_PRESSED_TRANSITION = "button-pressed-transition";
export const FORM_SUBMITTED_TRANSITION = "form-submitted-transition";

export class ButtonPressedStateTransition extends AppTransition {
  button: string;

  constructor(button: string) {
    super(BUTTON_PRESSED_TRANSITION);
    this.button = button;
  }
}

export class FormSubmittedStateTransition extends AppTransition {
  form: string;

  constructor(form: string) {
    super(FORM_SUBMITTED_TRANSITION);
    this.form = form;
  }
}
