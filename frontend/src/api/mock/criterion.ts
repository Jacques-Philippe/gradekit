import { type Criterion } from "@/types/criterion";
import { type ApiResult, err, ok } from "@/types/apiResult";

let criteria: Array<Criterion> = [
  {
    id: "criterion1",
    name: "Creativity",
    description: "Assesses creative thinking",
    totalPoints: 10,
  },
  {
    id: "criterion2",
    name: "Technical Skill",
    description: "Assesses technical proficiency",
    totalPoints: 5,
  },
  {
    id: "criterion3",
    name: "Presentation",
    description: "Assesses presentation quality",
    totalPoints: 1,
  },
];

export async function getCriteria(): Promise<ApiResult<Criterion[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ok([...criteria]);
}

export async function getCriterionById(
  id: string,
): Promise<ApiResult<Criterion>> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const criterion = criteria.find((c) => c.id === id);
  if (!criterion) return err(`Criterion with id ${id} not found`);
  return ok({ ...criterion });
}

export async function createCriterion(
  name: string,
  totalPoints: number,
  description?: string,
): Promise<ApiResult<Criterion>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (totalPoints < 0) {
    return err("Total points must be a non-negative number");
  }

  const normalizedName = name.trim();
  if (!normalizedName) {
    return err("Criterion name is required");
  }

  const exists = criteria.some(
    (c) => c.name.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (exists) {
    return err(`Criterion with name "${name}" already exists`);
  }

  const id = Math.random().toString(36).substring(2, 9);
  const criterion: Criterion = {
    id,
    name: normalizedName,
    totalPoints,
    description,
  };
  criteria = [...criteria, criterion];
  return ok({ ...criterion });
}

export async function deleteCriterion(
  id: string,
): Promise<ApiResult<Criterion>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const criterion = criteria.find((c) => c.id === id);
  if (!criterion) {
    return err(`Criterion with id ${id} not found`);
  }
  criteria = criteria.filter((c) => c.id !== id);
  return ok({ ...criterion });
}
