export interface Student {
  id: string;
  fullName: string;
  courses?: string[];
}

export type StudentSummary = Pick<Student, "id" | "fullName" | "courses">;
