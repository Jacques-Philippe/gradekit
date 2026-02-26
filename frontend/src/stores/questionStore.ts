import { defineStore } from "pinia";
import type { Question } from "@/types/question";
import {
  getQuestionsByAssignmentId as getQuestionsByAssignmentIdApi,
  createQuestion as createQuestionApi,
  deleteQuestion as deleteQuestionApi,
} from "@/api/mock/question";
import { withLoading } from "@/utils/withLoading";

export const useQuestionStore = defineStore("question", {
  state: () => ({
    error: "" as string,
    loading: false,
    questions: [] as Question[],
    currentQuestion: null as Question | null,
  }),
  actions: {
    async getQuestionsByAssignmentId(assignmentId: string): Promise<void> {
      const result = await withLoading(this, "Failed to load questions", () =>
        getQuestionsByAssignmentIdApi(assignmentId),
      );
      if (result.ok) {
        this.questions = result.data;
      } else {
        this.questions = [];
      }
    },
    async createQuestion(
      assignmentId: string,
      questionText: string,
    ): Promise<void> {
      const result = await withLoading(this, "Failed to create question", () =>
        createQuestionApi(assignmentId, questionText),
      );
      if (result.ok) {
        this.questions = [...this.questions, result.data];
      }
    },
    async deleteQuestion(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to delete question", () =>
        deleteQuestionApi(id),
      );
      if (result.ok) {
        this.questions = this.questions.filter((q) => q.id !== id);
      }
    },
    setCurrentQuestion(question: Question | null): void {
      this.currentQuestion = question;
    },
    clearCurrentQuestion(): void {
      this.currentQuestion = null;
      this.error = "";
    },
  },
});
