export interface Course {
  id: string;
  name: string;
}

export async function submitCourseName(name: string): Promise<Course> {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // return stubbed course
  return {
    id: Math.random().toString(36).substring(2, 9),
    name,
  };
}
