import { type Assignment } from "@/types/assignment";
import { type ApiResult, err, ok } from "@/types/apiResult";

let assignments: Array<Assignment> = [
  {
    id: "assignment1",
    courseId: "course1",
    title: "Project Proposal",
    description: "Submit a proposal for your project",
  },
  {
    id: "assignment2",
    courseId: "course1",
    title: "Midterm Report",
    description: "Submit a report on your progress at the midterm point",
  },
];

export async function getAssignments(): Promise<ApiResult<Assignment[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ok(assignments.map((a) => ({ ...a })));
}

export async function getAssignmentById(
  id: string,
): Promise<ApiResult<Assignment>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const assignment = assignments.find((a) => a.id === id);
  if (!assignment) return err(`Assignment with id ${id} not found`);
  return ok(assignment);
}

export async function getAssignmentsByCourseId(
  courseId: string,
): Promise<ApiResult<Assignment[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ok(assignments.filter((a) => a.courseId === courseId));
}

export async function createAssignment(
  title: string,
  description: string,
): Promise<ApiResult<Assignment>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    return err("Assignment title is required");
  }

  const exists = assignments.some(
    (a) => a.title.toLowerCase() === normalizedTitle.toLowerCase(),
  );
  if (exists) {
    return err(`Assignment with title "${title}" already exists`);
  }

  const id = Math.random().toString(36).substring(2, 9);
  const assignment: Assignment = { id, title: normalizedTitle, description };
  assignments = [...assignments, assignment];
  return ok(assignment);
}

export async function deleteAssignment(
  id: string,
): Promise<ApiResult<Assignment>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const assignment = assignments.find((a) => a.id === id);
  if (!assignment) {
    return err(`Assignment with id ${id} not found`);
  }
  assignments = assignments.filter((a) => a.id !== id);
  return ok(assignment);
}
