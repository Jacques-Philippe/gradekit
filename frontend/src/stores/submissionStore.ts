import { defineStore } from "pinia";
import type { Submission } from "@/types/submission";
import {
  createSubmission as createSubmissionApi,
  getSubmissions as getSubmissionsApi,
  getSubmissionById as getSubmissionByIdApi,
  deleteSubmission as deleteSubmissionApi,
} from "@/api/mock/submission";
import { withLoading } from "@/utils/withLoading";

export const useSubmissionStore = defineStore("submission", {
  state: () => ({
    error: "" as string,
    loading: false,
    submissions: [] as Submission[],
    currentSubmission: null as Submission | null,
  }),
  actions: {
    async getSubmissions(): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to load submissions",
        getSubmissionsApi,
      );
      if (result.ok) {
        this.submissions = result.data;
      } else {
        this.submissions = [];
      }
    },
    async getSubmissionById(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to load submission", () =>
        getSubmissionByIdApi(id),
      );
      if (result.ok) {
        this.currentSubmission = result.data;
      } else {
        this.currentSubmission = null;
      }
    },
    async createSubmission(
      assignmentId: string,
      studentId: string,
    ): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to create submission",
        () => createSubmissionApi(assignmentId, studentId),
      );
      if (result.ok) {
        this.submissions = [...this.submissions, result.data];
      }
    },
    async deleteSubmission(id: string): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to delete submission",
        () => deleteSubmissionApi(id),
      );
      if (result.ok) {
        this.submissions = this.submissions.filter((s) => s.id !== id);
      }
    },
    clearError() {
      this.error = "";
    },
  },
});
