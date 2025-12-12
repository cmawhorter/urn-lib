/**
 * Custom error class for URN parsing errors
 */
export class URNError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly field?: string,
    public readonly position?: number
  ) {
    super(message);
    this.name = 'URNError';
  }
}
