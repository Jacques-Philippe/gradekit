export const Routes = {
  Home: "/",
  Login: "/login",
  Register: "/register",
  MyCourses: "/courses",
  Course: "/courses/:id",
  CourseStudents: "/courses/:id/students",
  Assignment: "/assignments/:id",
  Settings: "/settings",
} as const;

export function courseRoute(id: number): string {
  return `/courses/${id}`;
}

export function courseStudentsRoute(id: number): string {
  return `/courses/${id}/students`;
}

export function assignmentRoute(id: number): string {
  return `/assignments/${id}`;
}
