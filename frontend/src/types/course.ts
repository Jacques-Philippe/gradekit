export interface Course {
  id: string;
  name: string;
}

export type CourseSummary = Pick<Course, "id" | "name">;
