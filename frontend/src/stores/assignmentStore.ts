import { defineStore } from "pinia";
import type { Assignment } from "@/types/assignment";
import {
  createAssignment as createAssignmentApi,
  getAssignments as getAssignmentsApi,
  getAssignmentById as getAssignmentByIdApi,
  getAssignmentsByCourseId as getAssignmentsByCourseIdApi,
  deleteAssignment as deleteAssignmentApi,
} from "@/api/mock/assignment";
import { toErrorMessage } from "@/utils/error";

export const useAssignmentStore = defineStore("assignment", {
  state: () => ({
    error: "" as string,
    loading: false,
    assignments: [] as Assignment[],
  }),
  actions: {
    async getAssignments(): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        // mock API call returns id + name
        this.assignments = await getAssignmentsApi();
      } catch (err) {
        this.error = `Failed to get assignments ${toErrorMessage(err)}`;
        this.assignments = [];
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
    async getAssignmentsByCourseId(courseId: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        this.assignments = await getAssignmentsByCourseIdApi(courseId);
      } catch (err) {
        this.error = `Failed to get assignments for course ${toErrorMessage(
          err,
        )}`;
        this.assignments = [];
      } finally {
        this.loading = false;
      }
    },
    async createAssignment(name: string, description: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const created = await createAssignmentApi(name, description);
        this.assignments = [...this.assignments, created];
      } catch (err) {
        this.error = `Failed to create assignment ${toErrorMessage(err)}`;
      } finally {
        this.loading = false;
      }
    },
    async deleteAssignment(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        await deleteAssignmentApi(id);
        this.assignments = this.assignments.filter((a) => a.id !== id);
      } catch (err) {
        this.error = `Failed to delete assignment ${toErrorMessage(err)}`;
      } finally {
        this.loading = false;
      }
    },
  },
});
