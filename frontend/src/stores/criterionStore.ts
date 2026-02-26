import { defineStore } from "pinia";
import type { Criterion } from "@/types/criterion";
import {
  createCriterion as createCriterionApi,
  getCriteria as getCriteriaApi,
  getCriterionById as getCriterionByIdApi,
  deleteCriterion as deleteCriterionApi,
} from "@/api/mock/criterion";

export const useCriterionStore = defineStore("criterion", {
  state: () => ({
    error: "" as string,
    loading: false,
    criteria: [] as Criterion[],
    criterion: null as Criterion | null,
  }),
  actions: {
    async getCriteria(): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getCriteriaApi();
        if (result.ok) {
          this.criteria = result.data;
        } else {
          this.error = `Failed to load criteria: ${result.error}`;
          this.criteria = [];
        }
      } catch {
        this.error = "Failed to load criteria: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async getCriterionById(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await getCriterionByIdApi(id);
        if (result.ok) {
          this.criterion = result.data;
        } else {
          this.error = `Failed to load criterion: ${result.error}`;
          this.criterion = null;
        }
      } catch {
        this.error = "Failed to load criterion: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async createCriterion(
      name: string,
      totalPoints: number,
      description?: string,
    ): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await createCriterionApi(name, totalPoints, description);
        if (result.ok) {
          this.criteria = [...this.criteria, result.data];
        } else {
          this.error = `Failed to create criterion: ${result.error}`;
        }
      } catch {
        this.error = "Failed to create criterion: unexpected error";
      } finally {
        this.loading = false;
      }
    },
    async deleteCriterion(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      try {
        const result = await deleteCriterionApi(id);
        if (result.ok) {
          this.criteria = this.criteria.filter((c) => c.id !== id);
          if (this.criterion?.id === id) {
            this.criterion = null;
          }
        } else {
          this.error = `Failed to delete criterion: ${result.error}`;
        }
      } catch {
        this.error = "Failed to delete criterion: unexpected error";
      } finally {
        this.loading = false;
      }
    },
  },
});
