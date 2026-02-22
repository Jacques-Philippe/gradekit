import { defineStore } from "pinia";
import type { Submission } from "@/types/submission";
import {
  createSubmission as createSubmissionApi,
  getSubmissions as getSubmissionsApi,
  getSubmissionById as getSubmissionByIdApi,
  deleteSubmission as deleteSubmissionApi,
} from "@/api/mock/submission";

export const useSubmissionStore = defineStore("submission", {
  state: () => ({
    error: "" as string,
    loading: false,
    submissions: [] as Submission[],
    currentSubmission: null as Submission | null,
  }),
  actions: {
    async getSubmissions(): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getSubmissionsApi();
      if (result.ok) {
        this.submissions = result.data;
      } else {
        this.error = `Failed to load submissions: ${result.error}`;
        this.submissions = [];
      }
      this.loading = false;
    },
    async getSubmissionById(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getSubmissionByIdApi(id);
      if (result.ok) {
        this.currentSubmission = result.data;
      } else {
        this.error = `Failed to load submission: ${result.error}`;
        this.currentSubmission = null;
      }
      this.loading = false;
    },
    async createSubmission(
      assignmentId: string,
      studentId: string,
    ): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await createSubmissionApi(assignmentId, studentId);
      this.loading = false;
      if (result.ok) {
        this.submissions = [...this.submissions, result.data];
      } else {
        this.error = `Failed to create submission: ${result.error}`;
      }
    },
    async deleteSubmission(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await deleteSubmissionApi(id);
      this.loading = false;
      if (result.ok) {
        this.submissions = this.submissions.filter((s) => s.id !== id);
      } else {
        this.error = `Failed to delete submission: ${result.error}`;
      }
    },
    clearError() {
      this.error = "";
    },
  },
});
