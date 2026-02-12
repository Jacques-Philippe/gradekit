export class AppTransition {
  /** The transition type */
  type: string;

  constructor(type: string) {
    this.type = type;
  }
}
export interface AppState {
  /** A unique name for the state, used for debugging and logging */
  name: string;
  setup(): void;
  teardown(): void;
  handleTransition(transition: AppTransition): AppState | null;
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
    const newState = this.currentState.handleTransition(transition);
    if (newState !== null && newState !== this.currentState) {
      this.currentState.teardown();
      this.currentState = newState;
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
