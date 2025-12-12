import { URNSecurityError } from '../errors/URNSecurityError';
import { hasNullBytes, hasControlCharacters } from './unicode';
import { defaultMaxLength, defaultAllowControlCharacters } from '../core/constants';

export type SanitizeInputOptions = {allowControlChars?: boolean; maxLength?: number};

/**
 * Sanitize and validate input string
 * @param input Raw input string
 * @param options Optional parser options that uses defaults if not explicit
 * @returns Sanitized input
 * @throws URNSecurityError if input fails security checks
 */
export function sanitizeInput(
  input: string,
  {
    allowControlChars = defaultAllowControlCharacters,
    maxLength = defaultMaxLength,
  }: SanitizeInputOptions = {}
): string {
  if (hasNullBytes(input)) {
    throw new URNSecurityError(
      'Input contains null bytes',
      'NULL_BYTE_DETECTED'
    );
  }
  if (!allowControlChars && hasControlCharacters(input)) {
    throw new URNSecurityError(
      'Input contains control characters',
      'CONTROL_CHAR_DETECTED'
    );
  }
  if (input.length > maxLength) {
    throw new URNSecurityError(
      `Input exceeds maximum length of ${maxLength} characters`,
      'MAX_LENGTH_EXCEEDED'
    );
  }
  return input;
}
