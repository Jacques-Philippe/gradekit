import { i18n } from "@/i18n";

const ERROR_KEY_MAP: Record<string, string> = {
  "Incorrect username or password": "errors.incorrect_credentials",
  "Username already registered": "errors.username_taken",
  "Course not found": "errors.course_not_found",
  "Course name already exists": "errors.course_name_taken",
  "Student not found in course": "errors.student_not_found",
  "Student name cannot be blank": "errors.student_name_blank",
  "CSV must have a 'full_name' column": "errors.csv_missing_column",
};

export function localizeError(error: string): string {
  const key = ERROR_KEY_MAP[error];
  if (key) return i18n.global.t(key);
  return error;
}
