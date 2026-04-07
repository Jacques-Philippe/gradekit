import { i18n } from "@/i18n";
import type { ApiError } from "@/api/apiFetch";

const ERROR_CODE_MAP: Record<string, string> = {
  ERR_INVALID_CREDENTIALS: "errors.incorrect_credentials",
  ERR_USERNAME_TAKEN: "errors.username_taken",
  ERR_COURSE_NOT_FOUND: "errors.course_not_found",
  ERR_COURSE_NAME_TAKEN: "errors.course_name_taken",
  ERR_STUDENT_NOT_FOUND: "errors.student_not_found",
  ERR_STUDENT_NAME_BLANK: "errors.student_name_blank",
  ERR_CSV_MISSING_COLUMN: "errors.csv_missing_column",
  ERR_UNSUPPORTED_FILE_ENCODING: "errors.unsupported_file_encoding",
};

export function localizeError(error: string | ApiError): string {
  const apiError = typeof error === "string" ? { detail: error } : error;
  if (apiError.code && apiError.code in ERROR_CODE_MAP) {
    const key = ERROR_CODE_MAP[apiError.code as string] as string;
    return i18n.global.t(key);
  }
  return apiError.detail;
}
