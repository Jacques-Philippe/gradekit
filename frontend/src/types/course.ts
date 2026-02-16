export interface Course {
  id: string;
  name: string;
  description?: string;
}

export type CourseSummary = Pick<Course, "id" | "name">;
