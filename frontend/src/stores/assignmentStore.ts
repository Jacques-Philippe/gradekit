import { defineStore } from "pinia";
import type { Assignment } from "@/types/assignment";
import {
  createAssignment as createAssignmentApi,
  getAssignments as getAssignmentsApi,
  getAssignmentById as getAssignmentByIdApi,
  deleteAssignment as deleteAssignmentApi,
} from "@/api/mock/assignment";
import { toErrorMessage } from "@/utils/error";

export const useAssignmentStore = defineStore("assignment", {
  state: () => ({
    error: "" as string,
    loading: false,
  }),
  actions: {
    async getAssignments(): Promise<Assignment[]> {
      this.loading = true;
      this.error = "";
      try {
        // mock API call returns id + name
        return await getAssignmentsApi();
      } catch (err) {
        this.error = `Failed to get assignments ${toErrorMessage(err)}`;
        return [];
      } finally {
        this.loading = false;
      }
    },
    async getAssignmentById(id: string): Promise<Assignment | null> {
      this.loading = true;
      this.error = "";
      try {
        return await getAssignmentByIdApi(id);
      } catch (err) {
        this.error = `Failed to get assignment ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createAssignment(
      name: string,
      description: string,
    ): Promise<Assignment | null> {
      this.loading = true;
      this.error = "";
      try {
        return await createAssignmentApi(name, description);
      } catch (err) {
        this.error = `Failed to create assignment ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteAssignment(id: string): Promise<Assignment | null> {
      this.loading = true;
      this.error = "";
      try {
        return await deleteAssignmentApi(id);
      } catch (err) {
        this.error = `Failed to delete assignment ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
