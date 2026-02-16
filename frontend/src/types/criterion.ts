// 1. Criterion
//       - id
//       - title
//       - description
//       - totalPoints

export interface Criterion {
  id: string;
  name: string;
  description?: string;
  totalPoints: number;
}
