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
/** A unique name for the transition where a button is pressed */
export const BUTTON_PRESSED_TRANSITION = "button-pressed-transition";

export class ButtonPressedStateTransition extends AppTransition {
  button: string;

  constructor(button: string) {
    super(BUTTON_PRESSED_TRANSITION);
    this.button = button;
  }
}
