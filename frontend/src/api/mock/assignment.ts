import { type Assignment } from "@/types/assignment";

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

export async function getAssignments(): Promise<Assignment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return assignments;
}

// return full assignment by id
export async function getAssignmentById(id: string): Promise<Assignment> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const assignment = assignments.find((a) => a.id === id);
  if (!assignment) throw new Error(`Assignment with id ${id} not found`);
  return assignment;
}

export async function getAssignmentsByCourseId(
  courseId: string,
): Promise<Assignment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return assignments.filter((a) => a.courseId === courseId);
}

export async function createAssignment(
  title: string,
  description: string,
): Promise<Assignment> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw new Error("Assignment title is required");
  }

  // check for duplicates
  const exists = assignments.some(
    (a) => a.title.toLowerCase() === normalizedTitle.toLowerCase(),
  );
  if (exists) {
    throw new Error(`Assignment with title "${title}" already exists`);
  }

  // create and add new assignment
  const id = Math.random().toString(36).substring(2, 9);
  const assignment: Assignment = { id, title: normalizedTitle, description };
  assignments = [...assignments, assignment];
  return assignment;
}

export async function deleteAssignment(id: string): Promise<Assignment> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const assignment = assignments.find((a) => a.id === id);
  if (!assignment) {
    throw new Error(`Assignment with id ${id} not found`);
  }
  assignments = assignments.filter((a) => a.id !== id);
  return assignment;
}
