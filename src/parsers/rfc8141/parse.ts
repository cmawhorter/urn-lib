/**
 * RFC 8141 URN parsing
 */

import type { RFC8141URN } from './types';
import type { ParserOptions } from '../../core/types';
import { createRFC8141URN } from './types';
import { validateNID } from '../rfc2141/validate';
import { validateNSS8141 } from './validate';
import { sanitizeInput } from '../../utils/security';
import { URNError, assertValid } from '../../core/validation';
import { DEFAULT_PARSER_OPTIONS } from '../../core/types';
import { extractRQF } from './rqf';

/**
 * Parse RFC 8141 URN string
 * Format: <NID>:<NSS>[?+<r-component>][?<q-component>][#<f-component>]
 * Note: Protocol (urn:) should be stripped before calling this function
 *
 * @param input URN string without protocol prefix
 * @param options Parser options
 * @returns Parsed RFC8141URN object
 * @throws URNError if parsing fails in strict mode
 */
export function parseRFC8141(input: string, options?: ParserOptions): RFC8141URN {
  const opts = { ...DEFAULT_PARSER_OPTIONS, ...options };

  // Security validation
  const sanitized = sanitizeInput(input, opts);

  // Extract RQF components first
  const { assignedName, rqf } = extractRQF(sanitized);

  // Parse assigned name (NID:NSS)
  const colonIndex = assignedName.indexOf(':');

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

  const nid = assignedName.slice(0, colonIndex);
  const nss = assignedName.slice(colonIndex + 1);

  // Validate NID
  if (opts.strict) {
    const nidResult = validateNID(nid);
    assertValid(nidResult, 'NID validation failed');
  }

  // Validate NSS (RFC 8141 rules)
  if (opts.strict) {
    const nssResult = validateNSS8141(nss, opts);
    assertValid(nssResult, 'NSS validation failed');
  }

  return createRFC8141URN(nid, nss, rqf);
}
