import { type Criterion } from "@/types/criterion";

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

export async function getCriteria(): Promise<Criterion[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...criteria];
}

// return full criterion by id
export async function getCriterionById(id: string): Promise<Criterion> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const criterion = criteria.find((c) => c.id === id);
  if (!criterion) throw new Error(`Criterion with id ${id} not found`);
  return { ...criterion };
}

// submit new criterion
export async function createCriterion(
  name: string,
  totalPoints: number,
  description?: string,
): Promise<Criterion> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const normalizedName = name.trim();
  if (!normalizedName) {
    throw new Error("Criterion name is required");
  }

  // check for duplicates
  const exists = criteria.some(
    (c) => c.name.toLowerCase() === normalizedName.toLowerCase(),
  );
  if (exists) {
    throw new Error(`Criterion with name "${name}" already exists`);
  }

  // create and add new criterion
  const id = Math.random().toString(36).substring(2, 9);
  const criterion: Criterion = {
    id,
    name: normalizedName,
    totalPoints,
    description,
  };
  criteria = [...criteria, criterion];
  return { ...criterion };
}

export async function deleteCriterion(id: string): Promise<Criterion> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const criterion = criteria.find((c) => c.id === id);
  if (!criterion) {
    throw new Error(`Criterion with id ${id} not found`);
  }
  criteria = criteria.filter((c) => c.id !== id);
  return { ...criterion };
}
