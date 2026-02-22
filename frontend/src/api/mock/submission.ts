import { type Submission } from "@/types/submission";
import { type ApiResult, err, ok } from "@/types/apiResult";

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

export async function getSubmissions(): Promise<ApiResult<Submission[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ok(submissions.map((s) => ({ ...s })));
}

export async function getSubmissionById(
  id: string,
): Promise<ApiResult<Submission>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const submission = submissions.find((s) => s.id === id);
  if (!submission) return err(`Submission with id ${id} not found`);
  return ok({ ...submission });
}

export async function createSubmission(
  assignmentId: string,
  studentId: string,
): Promise<ApiResult<Submission>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // if there already is a submission for this assignment and student, return an error
  const existingSubmission = submissions.find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId,
  );
  if (existingSubmission) {
    return err(
      `Submission for assignment ${assignmentId} and student ${studentId} already exists`,
    );
  }

  const id = Math.random().toString(36).substring(2, 9);
  const submission: Submission = { id, assignmentId, studentId };
  submissions = [...submissions, submission];
  return ok({ ...submission });
}

export async function deleteSubmission(
  submissionId: string,
): Promise<ApiResult<Submission>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const submission = submissions.find((s) => s.id === submissionId);
  if (!submission) {
    return err(`Submission with id ${submissionId} not found`);
  }
  submissions = submissions.filter((s) => s.id !== submissionId);
  return ok({ ...submission });
}
