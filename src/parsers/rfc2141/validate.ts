/**
 * RFC 2141 URN validation
 */

import type { RFC2141URN } from './types';
import type { ValidationResult, ParserOptions } from '../../core/types';
import { validResult, invalidResult, validationError } from '../../core/validation';
import { isValidPercentEncoding, hasEncodedControlChars } from '../../utils/encoding';

/**
 * NID validation rules per RFC 2141:
 * - Length: 2-31 characters
 * - Character set: [a-zA-Z0-9-]
 * - First character: must not be hyphen
 * - Reserved: 'urn' is forbidden
 */
const NID_PATTERN = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,29}[a-zA-Z0-9])?$/;
const NID_MIN_LENGTH = 2;
const NID_MAX_LENGTH = 31;

/**
 * NSS validation rules per RFC 2141:
 * - Allowed unencoded: alphanumeric + ( ) + , - . : = @ ; $ _ ! * '
 * - Must be percent-encoded: / ? # % and control characters
 */
const NSS_UNENCODED_PATTERN = /^[a-zA-Z0-9()+,\-.:=@;$_!*'%]*$/;

/**
 * Validate NID format
 */
export function validateNID(nid: string): ValidationResult {
  const errors = [];

  // Check length
  if (nid.length < NID_MIN_LENGTH || nid.length > NID_MAX_LENGTH) {
    errors.push(validationError(
      'INVALID_NID_LENGTH',
      `NID must be between ${NID_MIN_LENGTH} and ${NID_MAX_LENGTH} characters`,
      'nid'
    ));
  }

  // Check pattern
  if (!NID_PATTERN.test(nid)) {
    errors.push(validationError(
      'INVALID_NID_FORMAT',
      'NID must contain only alphanumeric characters and hyphens, and cannot start or end with a hyphen',
      'nid'
    ));
  }

  // Check reserved
  if (nid.toLowerCase() === 'urn') {
    errors.push(validationError(
      'RESERVED_NID',
      "NID 'urn' is reserved and cannot be used",
      'nid'
    ));
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}

/**
 * Validate NSS format
 */
export function validateNSS(nss: string, options?: ParserOptions): ValidationResult {
  const errors = [];

  // Check if NSS is empty
  if (nss.length === 0) {
    errors.push(validationError(
      'EMPTY_NSS',
      'NSS cannot be empty',
      'nss'
    ));
    return invalidResult(errors);
  }

  // Check character set (only unencoded allowed chars and %)
  if (!NSS_UNENCODED_PATTERN.test(nss)) {
    errors.push(validationError(
      'INVALID_NSS_CHARACTERS',
      'NSS contains characters that must be percent-encoded',
      'nss'
    ));
  }

  // Validate percent-encoding format
  if (!options?.allowInvalidEncoding && !isValidPercentEncoding(nss)) {
    errors.push(validationError(
      'INVALID_ENCODING',
      'NSS contains invalid percent-encoding',
      'nss'
    ));
  }

  // Check for encoded control characters and null bytes
  if (!options?.allowControlChars && hasEncodedControlChars(nss)) {
    errors.push(validationError(
      'ENCODED_CONTROL_CHARS',
      'NSS contains encoded control characters',
      'nss'
    ));
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}

/**
 * Validate complete RFC 2141 URN
 */
export function validateRFC2141(urn: RFC2141URN, options?: ParserOptions): ValidationResult {
  const errors = [];

  // Validate NID
  const nidResult = validateNID(urn.nid.value);
  if (!nidResult.valid) {
    errors.push(...nidResult.errors);
  }

  // Validate NSS
  const nssResult = validateNSS(urn.nss.encoded, options);
  if (!nssResult.valid) {
    errors.push(...nssResult.errors);
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}
