/**
 * RFC 2141 specific types
 */

import type { IURN, NIDValue, NSSValue } from '../../core/interfaces';
import type { ValidationResult } from '../../core/types';
import { normalizeForComparison, equalsIgnoreCase } from '../../utils/unicode';
import { normalizePercentEncoding } from '../../utils/encoding';

/**
 * RFC 2141 URN structure
 */
export interface RFC2141URN extends IURN {
  readonly nid: NIDValue;
  readonly nss: NSSValue;
  equals(other: IURN): boolean;
}

/**
 * Create an RFC 2141 URN object
 */
export function createRFC2141URN(nid: string, nss: string): RFC2141URN {
  return {
    nid: { value: nid },
    nss: { encoded: nss },
    equals(other: IURN): boolean {
      return checkRFC2141Equivalence(this, other);
    }
  };
}

/**
 * Check equivalence between two URNs per RFC 2141 rules
 * - NID is case-insensitive
 * - NSS is case-sensitive
 * - Percent-encoding is normalized but preserved
 */
export function checkRFC2141Equivalence(a: IURN, b: IURN): boolean {
  // NID comparison: case-insensitive
  if (!equalsIgnoreCase(a.nid.value, b.nid.value)) {
    return false;
  }

  // NSS comparison: case-sensitive with normalization
  const nssA = normalizePercentEncoding(normalizeForComparison(a.nss.encoded));
  const nssB = normalizePercentEncoding(normalizeForComparison(b.nss.encoded));

  return nssA === nssB;
}
