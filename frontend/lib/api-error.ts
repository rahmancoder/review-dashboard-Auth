export type ApiFieldError = { path: string; message: string };



/** Error thrown for any non-2xx / unreachable-backend situation. Safe to import anywhere. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: ApiFieldError[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}
