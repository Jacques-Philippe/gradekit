import { defineStore } from "pinia";
import type { Criterion } from "@/types/criterion";
import {
  createCriterion as createCriterionApi,
  getCriteria as getCriteriaApi,
  getCriterionById as getCriterionByIdApi,
  deleteCriterion as deleteCriterionApi,
} from "@/api/mock/criterion";
import { toErrorMessage } from "@/utils/error";

export const useCriterionStore = defineStore("criterion", {
  state: () => ({
    error: "" as string,
    loading: false,
  }),
  actions: {
    async getCriterions(): Promise<Criterion[]> {
      this.loading = true;
      this.error = "";
      try {
        // mock API call returns id + name
        return await getCriteriaApi();
      } catch (err) {
        this.error = `Failed to load criterions ${toErrorMessage(err)}`;
        return [];
      } finally {
        this.loading = false;
      }
    },
    async getCriterionById(id: string): Promise<Criterion | null> {
      this.loading = true;
      this.error = "";
      try {
        return await getCriterionByIdApi(id);
      } catch (err) {
        this.error = `Failed to load criterion ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createCriterion(
      name: string,
      totalPoints: number,
      description?: string,
    ): Promise<Criterion | null> {
      this.loading = true;
      this.error = "";

      try {
        return await createCriterionApi(name, totalPoints, description);
      } catch (err) {
        this.error = `Failed to create criterion ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
    async deleteCriterion(id: string): Promise<Criterion | null> {
      this.loading = true;
      this.error = "";
      try {
        return await deleteCriterionApi(id);
      } catch (err) {
        this.error = `Failed to delete criterion ${toErrorMessage(err)}`;
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
