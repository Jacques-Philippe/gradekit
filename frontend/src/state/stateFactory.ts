// stateFactory.ts
import type { AppState, StateChange } from "@/types/state";
import { HOME_VIEW_STATE_NAME, COURSE_VIEW_STATE_NAME } from "@/types/state";
import { HomeViewState } from "@/state/homeViewState";
import { CourseViewState } from "@/state/courseViewState";

export function createState(stateChange: StateChange): AppState {
  const { target } = stateChange;
  switch (target) {
    case HOME_VIEW_STATE_NAME:
      return new HomeViewState();
    case COURSE_VIEW_STATE_NAME:
      return new CourseViewState();
    default:
      throw new Error(`Unknown state: ${target}`);
  }
}
