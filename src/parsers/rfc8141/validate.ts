/**
 * RFC 8141 URN validation
 */

import type { RFC8141URN } from './types';
import type { ValidationResult, ParserOptions, RQFComponents } from '../../core/types';
import { validResult, invalidResult, validationError } from '../../core/validation';
import { validateNID } from '../rfc2141/validate';
import { isValidPercentEncoding, hasEncodedControlChars } from '../../utils/encoding';

/**
 * NSS validation rules per RFC 8141:
 * - Extended character set compared to RFC 2141
 * - Allowed unencoded: alphanumeric + ( ) + , - . : = @ ; $ _ ! * ' / ~ &
 * - Must be percent-encoded: ? # % and control characters
 */
const NSS_UNENCODED_PATTERN = /^[a-zA-Z0-9()+,\-.:=@;$_!*'/~&%]*$/;

/**
 * Validate NSS format for RFC 8141
 */
export function validateNSS8141(nss: string, options?: ParserOptions): ValidationResult {
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
 * Validate RQF components
 */
export function validateRQFComponents(rqf?: RQFComponents): ValidationResult {
  if (!rqf) {
    return validResult();
  }

  // RQF components are relatively permissive
  // Main validation is that they don't contain null bytes or unescaped newlines
  const errors = [];

  // eslint-disable-next-line no-control-regex
  if (rqf.resolution !== undefined && /[\x00\r\n]/.test(rqf.resolution)) {
    errors.push(validationError(
      'INVALID_RQF_RESOLUTION',
      'Resolution component contains invalid characters',
      'rqf.resolution'
    ));
  }

  // eslint-disable-next-line no-control-regex
  if (rqf.query !== undefined && /[\x00\r\n]/.test(rqf.query)) {
    errors.push(validationError(
      'INVALID_RQF_QUERY',
      'Query component contains invalid characters',
      'rqf.query'
    ));
  }

  // eslint-disable-next-line no-control-regex
  if (rqf.fragment !== undefined && /[\x00\r\n]/.test(rqf.fragment)) {
    errors.push(validationError(
      'INVALID_RQF_FRAGMENT',
      'Fragment component contains invalid characters',
      'rqf.fragment'
    ));
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}

/**
 * Validate complete RFC 8141 URN
 */
export function validateRFC8141(urn: RFC8141URN, options?: ParserOptions): ValidationResult {
  const errors = [];

  // Validate NID (same as RFC 2141)
  const nidResult = validateNID(urn.nid.value);
  if (!nidResult.valid) {
    errors.push(...nidResult.errors);
  }

  // Validate NSS (RFC 8141 rules)
  const nssResult = validateNSS8141(urn.nss.encoded, options);
  if (!nssResult.valid) {
    errors.push(...nssResult.errors);
  }

  // Validate RQF components
  const rqfResult = validateRQFComponents(urn.rqf);
  if (!rqfResult.valid) {
    errors.push(...rqfResult.errors);
  }

  return errors.length > 0 ? invalidResult(errors) : validResult();
}
