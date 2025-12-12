/**
 * Validation utilities and result handling
 */

// import { defaultMaxLength } from './constants';
import { URNError } from '../errors/URNError';
// import { URNSecurityError } from './URNSecurityError';

/**
 * Validation error detail
 */
export type ValidationError = {
  readonly code: string;           // Error code like 'INVALID_NID', 'INVALID_ENCODING'
  readonly message: string;        // Human-readable error message
  readonly field?: string;         // Which component failed
  readonly position?: number;      // Character position if applicable
};

/**
 * Result of validation operation
 */
export type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly errors: readonly ValidationError[] };

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
