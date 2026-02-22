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

// Form names
export const NEW_COURSE_FORM_NAME = "NewCourseForm";

// Button names
export const BACK_BUTTON_NAME = "BackButton";
export const COURSE_BUTTON_NAME = "CourseButton";
export const STUDENTS_BUTTON_NAME = "StudentsButton";
export const ASSIGNMENTS_BUTTON_NAME = "AssignmentsButton";
export const EDIT_QUESTION_BUTTON_NAME = "EditQuestionButton";
export const GRADE_BUTTON_NAME = "GradeButton";
export const EXPORT_GRADES_BUTTON_NAME = "ExportGradesButton";

// State names
export const HOME_VIEW_STATE_NAME = "HomeView";
export const COURSE_VIEW_STATE_NAME = "CourseView";
export const COURSE_ASSIGNMENTS_VIEW_STATE_NAME = "CourseAssignmentsView";
export const COURSE_STUDENTS_VIEW_STATE_NAME = "CourseStudentsView";
export const ASSIGNMENT_VIEW_STATE_NAME = "AssignmentView";
export const ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME = "AssignmentQuestionsView";
export const GRADE_ASSIGNMENT_VIEW_STATE_NAME = "GradeAssignmentView";

/** A unique name for the transition where a button is pressed */
export const BUTTON_PRESSED_TRANSITION = "button-pressed-transition";
export const FORM_SUBMITTED_TRANSITION = "form-submitted-transition";
export const ASSIGNMENT_BUTTON_PRESSED_TRANSITION =
  "assignment-button-pressed-transition";

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

export class AssignmentButtonPressedStateTransition extends AppTransition {
  assignmentId: string;

  constructor(assignmentId: string) {
    super(ASSIGNMENT_BUTTON_PRESSED_TRANSITION);
    this.assignmentId = assignmentId;
  }
}
