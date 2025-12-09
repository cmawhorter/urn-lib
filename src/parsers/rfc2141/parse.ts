/**
 * RFC 2141 URN parsing
 */

import type { RFC2141URN } from './types';
import type { ParserOptions } from '../../core/types';
import { createRFC2141URN } from './types';
import { validateNID, validateNSS } from './validate';
import { sanitizeInput } from '../../utils/security';
import { URNError, assertValid } from '../../core/validation';
import { DEFAULT_PARSER_OPTIONS } from '../../core/types';

/**
 * Parse RFC 2141 URN string
 * Format: <NID>:<NSS>
 * Note: Protocol (urn:) should be stripped before calling this function
 *
 * @param input URN string without protocol prefix
 * @param options Parser options
 * @returns Parsed RFC2141URN object
 * @throws URNError if parsing fails in strict mode
 */
export function parseRFC2141(input: string, options?: ParserOptions): RFC2141URN {
  const opts = { ...DEFAULT_PARSER_OPTIONS, ...options };

  // Security validation
  const sanitized = sanitizeInput(input, opts);

  // Split on first colon
  const colonIndex = sanitized.indexOf(':');

  if (colonIndex === -1) {
    throw new URNError(
      'Invalid URN format: missing colon separator between NID and NSS',
      'MISSING_SEPARATOR'
    );
  }

  if (colonIndex === 0) {
    throw new URNError(
      'Invalid URN format: missing NID',
      'MISSING_NID'
    );
  }

  const nid = sanitized.slice(0, colonIndex);
  const nss = sanitized.slice(colonIndex + 1);

  // Validate NID
  if (opts.strict) {
    const nidResult = validateNID(nid);
    assertValid(nidResult, 'NID validation failed');
  }

  // Validate NSS
  if (opts.strict) {
    const nssResult = validateNSS(nss, opts);
    assertValid(nssResult, 'NSS validation failed');
  }

  return createRFC2141URN(nid, nss);
}
