import { defineStore } from "pinia";
import type { Question } from "@/types/question";
import {
  getQuestionsByAssignmentId as getQuestionsByAssignmentIdApi,
  createQuestion as createQuestionApi,
  deleteQuestion as deleteQuestionApi,
} from "@/api/mock/question";

export const useQuestionStore = defineStore("question", {
  state: () => ({
    error: "" as string,
    loading: false,
    questions: [] as Question[],
    currentQuestion: null as Question | null,
  }),
  actions: {
    async getQuestionsByAssignmentId(assignmentId: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getQuestionsByAssignmentIdApi(assignmentId);
      if (result.ok) {
        this.questions = result.data;
      } else {
        this.error = `Failed to load questions: ${result.error}`;
        this.questions = [];
      }
      this.loading = false;
    },
    async createQuestion(
      assignmentId: string,
      questionText: string,
    ): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await createQuestionApi(assignmentId, questionText);
      this.loading = false;
      if (result.ok) {
        this.questions = [...this.questions, result.data];
      } else {
        this.error = `Failed to create question: ${result.error}`;
      }
    },
    async deleteQuestion(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await deleteQuestionApi(id);
      this.loading = false;
      if (result.ok) {
        this.questions = this.questions.filter((q) => q.id !== id);
      } else {
        this.error = `Failed to delete question: ${result.error}`;
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
