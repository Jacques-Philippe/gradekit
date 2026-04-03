import { type Question } from "@/types/question";
import { type ApiResult, err, ok } from "@/types/apiResult";

let questions: Array<Question> = [
  {
    id: "question1",
    assignmentId: "assignment1",
    questionText: "What is the main objective of your project?",
  },
  {
    id: "question2",
    assignmentId: "assignment1",
    questionText: "What technologies do you plan to use?",
  },
  {
    id: "question3",
    assignmentId: "assignment1",
    questionText: "What is your expected timeline for completion?",
  },
  {
    id: "question4",
    assignmentId: "assignment2",
    questionText: "What progress have you made so far?",
  },
  {
    id: "question5",
    assignmentId: "assignment2",
    questionText: "What challenges have you encountered?",
  },
  {
    id: "question6",
    assignmentId: "assignment2",
    questionText: "What are your next steps?",
  },
];

export async function getQuestionsByAssignmentId(
  assignmentId: string,
): Promise<ApiResult<Question[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const assignmentQuestions = questions.filter(
    (q) => q.assignmentId === assignmentId,
  );
  return ok(assignmentQuestions.map((q) => ({ ...q })));
}

export async function createQuestion(
  assignmentId: string,
  questionText: string,
): Promise<ApiResult<Question>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedText = questionText.trim();
  if (!normalizedText) {
    return err("Question text is required");
  }

  const id = Math.random().toString(36).substring(2, 9);
  const question: Question = {
    id,
    assignmentId,
    questionText: normalizedText,
  };
  questions = [...questions, question];
  return ok({ ...question });
}

export async function deleteQuestion(id: string): Promise<ApiResult<Question>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const question = questions.find((q) => q.id === id);
  if (!question) {
    return err(`Question with id ${id} not found`);
  }
  questions = questions.filter((q) => q.id !== id);
  return ok({ ...question });
}
