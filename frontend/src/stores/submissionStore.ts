import { defineStore } from "pinia";
import type { Submission } from "@/types/submission";
import {
  createSubmission as createSubmissionApi,
  getSubmissions as getSubmissionsApi,
  getSubmissionById as getSubmissionByIdApi,
  deleteSubmission as deleteSubmissionApi,
} from "@/api/mock/submission";
import { toErrorMessage } from "@/utils/error";

export const useSubmissionStore = defineStore("submission", {
  state: () => ({
    error: "" as string,
    loading: false,
    submissions: [] as Submission[],
  }),
  actions: {
    async getSubmissions(): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        this.submissions = await getSubmissionsApi();
      } catch (err) {
        this.error = `Failed to load submissions ${toErrorMessage(err)}`;
        this.submissions = [];
      } finally {
        this.loading = false;
      }
    },
    async getSubmissionById(id: string): Promise<Submission | null> {
      this.loading = true;
      this.error = "";
      try {
        return await getSubmissionByIdApi(id);
      } catch (err) {
        this.error = `Failed to load submission ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createSubmission(
      assignmentId: string,
      studentId: string,
    ): Promise<Submission | null> {
      this.loading = true;
      this.error = "";
      try {
        return await createSubmissionApi(assignmentId, studentId);
      } catch (err) {
        this.error = `Failed to create submission ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteSubmission(id: string): Promise<Submission | null> {
      this.loading = true;
      this.error = "";
      try {
        return await deleteSubmissionApi(id);
      } catch (err) {
        this.error = `Failed to delete submission ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    clearError() {
      this.error = "";
    },
  },
});
