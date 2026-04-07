import { type ApiResult, err } from "@/types/apiResult";

export async function withLoading<T>(
  store: { loading: boolean; error: string },
  failureMessage: string,
  fn: () => Promise<ApiResult<T>>,
): Promise<ApiResult<T>> {
  store.loading = true;
  store.error = "";
  try {
    const result = await fn();
    if (!result.ok) {
      store.error = `${failureMessage}: ${result.error.detail}`;
    }
    return result;
  } catch {
    store.error = `${failureMessage}: unexpected error`;
    return err("unexpected error");
  } finally {
    store.loading = false;
  }
}
