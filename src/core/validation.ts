/**
 * Validation utilities and result handling
 */

import type { ValidationResult, ValidationError, ParserOptions } from './types';

/**
 * Create a successful validation result
 */
export function validResult(): ValidationResult {
  return { valid: true };
}

/**
 * Create a failed validation result with errors
 */
export function invalidResult(errors: ValidationError[]): ValidationResult {
  return { valid: false, errors };
}

/**
 * Create a validation error
 */
export function validationError(
  code: string,
  message: string,
  field?: string,
  position?: number
): ValidationError {
  return { code, message, field, position };
}

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

/**
 * Custom error class for security-related errors
 */
export class URNSecurityError extends URNError {
  constructor(message: string, code: string = 'SECURITY_ERROR', field?: string) {
    super(message, code, field);
    this.name = 'URNSecurityError';
  }
}

/**
 * Convert validation result to error (throws if invalid)
 */
export function assertValid(result: ValidationResult, context?: string): void {
  if (!result.valid) {
    const prefix = context ? `${context}: ` : '';
    const firstError = result.errors[0];
    throw new URNError(
      `${prefix}${firstError.message}`,
      firstError.code,
      firstError.field,
      firstError.position
    );
  }
}

/**
 * Validate input length
 */
export function validateLength(input: string, options: ParserOptions): void {
  const maxLength = options.maxLength ?? 8192;
  if (input.length > maxLength) {
    throw new URNSecurityError(
      `Input exceeds maximum length of ${maxLength} characters`,
      'MAX_LENGTH_EXCEEDED'
    );
  }
}
