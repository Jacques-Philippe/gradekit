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
  }),
  actions: {
    async getCriteria(): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await getCriteriaApi();
      if (result.ok) {
        this.criteria = result.data;
      } else {
        this.error = `Failed to load criteria: ${result.error}`;
        this.criteria = [];
      }
      this.loading = false;
    },
    async getCriterionById(id: string): Promise<Criterion | null> {
      this.loading = true;
      this.error = "";
      const result = await getCriterionByIdApi(id);
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to load criterion: ${result.error}`;
      return null;
    },
    async createCriterion(
      name: string,
      totalPoints: number,
      description?: string,
    ): Promise<Criterion | null> {
      this.loading = true;
      this.error = "";
      const result = await createCriterionApi(name, totalPoints, description);
      this.loading = false;
      if (result.ok) return result.data;
      this.error = `Failed to create criterion: ${result.error}`;
      return null;
    },
    async deleteCriterion(id: string): Promise<void> {
      this.loading = true;
      this.error = "";
      const result = await deleteCriterionApi(id);
      this.loading = false;
      if (result.ok) return;
      this.error = `Failed to delete criterion: ${result.error}`;
    },
  },
});
