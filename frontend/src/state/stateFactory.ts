import type { AppState, StateChange } from "@/types/state";
import {
  HOME_VIEW_STATE_NAME,
  COURSE_VIEW_STATE_NAME,
  COURSE_STUDENTS_VIEW_STATE_NAME,
  COURSE_ASSIGNMENTS_VIEW_STATE_NAME,
  ASSIGNMENT_VIEW_STATE_NAME,
  ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME,
  GRADE_ASSIGNMENT_VIEW_STATE_NAME,
} from "@/types/state";
import { HomeViewState } from "@/state/homeViewState";
import { CourseViewState } from "@/state/courseViewState";
import { CourseStudentsViewState } from "@/state/courseStudentsViewState";
import { CourseAssignmentsViewState } from "@/state/courseAssignmentsViewState";
import { AssignmentViewState } from "@/state/assignmentViewState";
import { AssignmentQuestionsViewState } from "./assignmentQuestionsViewState";
import { GradeAssignmentViewState } from "./gradeAssignmentViewState";

export function createState(stateChange: StateChange): AppState {
  const { target } = stateChange;
  switch (target) {
    case HOME_VIEW_STATE_NAME:
      return new HomeViewState();
    case COURSE_VIEW_STATE_NAME:
      return new CourseViewState();
    case COURSE_STUDENTS_VIEW_STATE_NAME:
      return new CourseStudentsViewState();
    case COURSE_ASSIGNMENTS_VIEW_STATE_NAME:
      return new CourseAssignmentsViewState();
    case ASSIGNMENT_VIEW_STATE_NAME:
      return new AssignmentViewState();
    case ASSIGNMENT_QUESTIONS_VIEW_STATE_NAME:
      return new AssignmentQuestionsViewState();
    case GRADE_ASSIGNMENT_VIEW_STATE_NAME:
      return new GradeAssignmentViewState();
    default:
      throw new Error(`Unknown state: ${target}`);
  }
}
