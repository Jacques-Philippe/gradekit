import { defineStore } from "pinia";
import type { Assignment } from "@/types/assignment";
import {
  createAssignment as createAssignmentApi,
  getAssignments as getAssignmentsApi,
  getAssignmentById as getAssignmentByIdApi,
  getAssignmentsByCourseId as getAssignmentsByCourseIdApi,
  deleteAssignment as deleteAssignmentApi,
} from "@/api/mock/assignment";

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
      const result = await getAssignmentsApi();
      if (result.ok) {
        this.assignments = result.data;
      } else {
        this.error = `Failed to get assignments: ${result.error}`;
        this.assignments = [];
      }
      this.loading = false;
    },
    async getAssignmentById(id: string): Promise<Assignment | null> {
      this.loading = true;
      this.error = "";
      const result = await getAssignmentByIdApi(id);
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to get assignment: ${result.error}`;
      return null;
    },
    async getAssignmentsByCourseId(courseId: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getAssignmentsByCourseIdApi(courseId);
      if (result.ok) {
        this.assignments = result.data;
      } else {
        this.error = `Failed to get assignments for course: ${result.error}`;
        this.assignments = [];
      }
      this.loading = false;
    },
    async createAssignment(
      courseId: string,
      name: string,
      description: string,
    ): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await createAssignmentApi(courseId, name, description);
      this.loading = false;
      if (result.ok) {
        this.assignments = [...this.assignments, result.data];
      } else {
        this.error = `Failed to create assignment: ${result.error}`;
      }
    },
    async deleteAssignment(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await deleteAssignmentApi(id);
      this.loading = false;
      if (result.ok) {
        this.assignments = this.assignments.filter((a) => a.id !== id);
      } else {
        this.error = `Failed to delete assignment: ${result.error}`;
      }
    },
  },
});
