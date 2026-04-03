export const Routes = {
  Home: "/",
  Login: "/login",
  Register: "/register",
  Course: "/courses/:id",
  Assignment: "/assignments/:id",
} as const;

export function courseRoute(id: number): string {
  return `/courses/${id}`;
}

export function assignmentRoute(id: number): string {
  return `/assignments/${id}`;
}
