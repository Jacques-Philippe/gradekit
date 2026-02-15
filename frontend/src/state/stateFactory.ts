import type { AppState, StateChange } from "@/types/state";
import {
  HOME_VIEW_STATE_NAME,
  COURSE_VIEW_STATE_NAME,
  COURSE_STUDENTS_VIEW_STATE_NAME,
  COURSE_ASSIGNMENTS_VIEW_STATE_NAME,
} from "@/types/state";
import { HomeViewState } from "@/state/homeViewState";
import { CourseViewState } from "@/state/courseViewState";
import { CourseStudentsViewState } from "@/state/courseStudentsViewState";
import { CourseAssignmentsViewState } from "@/state/courseAssignmentsViewState";

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
    default:
      throw new Error(`Unknown state: ${target}`);
  }
}
