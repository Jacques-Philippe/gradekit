import { type Submission } from "@/types/submission";

let submissions: Array<Submission> = [
  {
    id: "submission1",
    assignmentId: "assignment1",
    studentId: "student1",
  },
  {
    id: "submission2",
    assignmentId: "assignment2",
    studentId: "student2",
  },
];

export async function getSubmissions(): Promise<Submission[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return submissions;
}

// return full submission by id
export async function getSubmissionById(id: string): Promise<Submission> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const submission = submissions.find((s) => s.id === id);
  if (!submission) throw new Error(`Submission with id ${id} not found`);
  return submission;
}

// submit new submission
export async function createSubmission(
  assignmentId: string,
  studentId: string,
): Promise<Submission> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // create and add new submission
  const id = Math.random().toString(36).substring(2, 9);
  const submission: Submission = { id, assignmentId, studentId };
  submissions = [...submissions, submission];
  return submission;
}

export async function deleteSubmission(
  submissionId: string,
): Promise<Submission> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const submission = submissions.find((s) => s.id === submissionId);
  if (!submission) {
    throw new Error(`Submission with id ${submissionId} not found`);
  }
  submissions = submissions.filter((s) => s.id !== submissionId);
  return submission;
}
