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
  }),
  actions: {
    async getSubmissions(): Promise<Submission[]> {
      this.loading = true;
      this.error = "";
      try {
        return await getSubmissionsApi();
      } catch (err) {
        this.error = `Failed to load submissions ${toErrorMessage(err)}`;
        return [];
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
