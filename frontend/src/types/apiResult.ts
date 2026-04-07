import type { ApiError } from "@/api/apiFetch";

/**
 * Generic result type for API operations. Represents either success with data
 * or failure with an error message. Use this instead of throwing so callers
 * can handle errors in a consistent, type-safe way.
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

export function err<T>(error: ApiError | string): ApiResult<T> {
  const apiError = typeof error === "string" ? { detail: error } : error;
  return { ok: false, error: apiError };
}
