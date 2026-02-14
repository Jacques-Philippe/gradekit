export interface Student {
  id: string;
  fullName: string;
}

export type StudentSummary = Pick<Student, "id" | "fullName">;
