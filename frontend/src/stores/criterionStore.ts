import { defineStore } from "pinia";
import type { Criterion } from "@/types/criterion";
import {
  createCriterion as createCriterionApi,
  getCriteria as getCriteriaApi,
  getCriterionById as getCriterionByIdApi,
  deleteCriterion as deleteCriterionApi,
} from "@/api/mock/criterion";
import { withLoading } from "@/utils/withLoading";

export const useCriterionStore = defineStore("criterion", {
  state: () => ({
    error: "" as string,
    loading: false,
    criteria: [] as Criterion[],
    criterion: null as Criterion | null,
  }),
  actions: {
    async getCriteria(): Promise<void> {
      const result = await withLoading(
        this,
        "Failed to load criteria",
        getCriteriaApi,
      );
      if (result.ok) {
        this.criteria = result.data;
      } else {
        this.criteria = [];
      }
    },
    async getCriterionById(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to load criterion", () =>
        getCriterionByIdApi(id),
      );
      if (result.ok) {
        this.criterion = result.data;
      } else {
        this.criterion = null;
      }
    },
    async createCriterion(
      name: string,
      totalPoints: number,
      description?: string,
    ): Promise<void> {
      const result = await withLoading(this, "Failed to create criterion", () =>
        createCriterionApi(name, totalPoints, description),
      );
      if (result.ok) {
        this.criteria = [...this.criteria, result.data];
      }
    },
    async deleteCriterion(id: string): Promise<void> {
      const result = await withLoading(this, "Failed to delete criterion", () =>
        deleteCriterionApi(id),
      );
      if (result.ok) {
        this.criteria = this.criteria.filter((c) => c.id !== id);
        if (this.criterion?.id === id) {
          this.criterion = null;
        }
      }
    },
  },
});
