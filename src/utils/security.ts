/**
 * Security utilities for input validation and sanitization
 */

import { URNSecurityError } from '../core/validation';
import { hasNullBytes, hasControlCharacters } from './unicode';
import type { ParserOptions } from '../core/types';

/**
 * Sanitize and validate input string
 * @param input Raw input string
 * @param options Parser options
 * @returns Sanitized input
 * @throws URNSecurityError if input fails security checks
 */
export function sanitizeInput(input: string, options?: ParserOptions): string {
  // Check for null bytes (always forbidden)
  if (hasNullBytes(input)) {
    throw new URNSecurityError(
      'Input contains null bytes',
      'NULL_BYTE_DETECTED'
    );
  }

  // Check for control characters (forbidden unless explicitly allowed)
  if (!options?.allowControlChars && hasControlCharacters(input)) {
    throw new URNSecurityError(
      'Input contains control characters',
      'CONTROL_CHAR_DETECTED'
    );
  }

  // Check length
  const maxLength = options?.maxLength ?? 8192;
  if (input.length > maxLength) {
    throw new URNSecurityError(
      `Input exceeds maximum length of ${maxLength} characters`,
      'MAX_LENGTH_EXCEEDED'
    );
  }

  return input;
}

/**
 * Validate that a string contains only allowed characters
 * @param str String to validate
 * @param allowedPattern Regex pattern for allowed characters
 * @param errorMessage Error message if validation fails
 */
export function validateCharacterSet(
  str: string,
  allowedPattern: RegExp,
  errorMessage: string
): void {
  if (!allowedPattern.test(str)) {
    throw new URNSecurityError(errorMessage, 'INVALID_CHARACTER_SET');
  }
}

/**
 * Check if string is potentially malicious
 * Looks for common injection patterns
 */
export function checkForInjection(str: string): void {
  // Check for newline injection
  if (/[\r\n]/.test(str)) {
    throw new URNSecurityError(
      'Input contains newline characters',
      'NEWLINE_INJECTION'
    );
  }
}
