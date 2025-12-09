/**
 * RFC 8141 specific types
 */

import type { IURN8141, NIDValue, NSSValue } from '../../core/interfaces';
import type { RQFComponents } from '../../core/types';
import { checkRFC2141Equivalence } from '../rfc2141/types';

/**
 * RFC 8141 URN structure with RQF components
 */
export interface RFC8141URN extends IURN8141 {
  readonly nid: NIDValue;
  readonly nss: NSSValue;
  readonly rqf?: RQFComponents;
  equals(other: IURN8141): boolean;
}

/**
 * Create an RFC 8141 URN object
 */
export function createRFC8141URN(nid: string, nss: string, rqf?: RQFComponents): RFC8141URN {
  return {
    nid: { value: nid },
    nss: { encoded: nss },
    rqf,
    equals(other: IURN8141): boolean {
      return checkRFC8141Equivalence(this, other);
    }
  };
}

/**
 * Check equivalence between two RFC 8141 URNs
 * Same as RFC 2141 but RQF components are ignored
 */
export function checkRFC8141Equivalence(a: IURN8141, b: IURN8141): boolean {
  // Use RFC 2141 equivalence rules (ignores RQF)
  return checkRFC2141Equivalence(a, b);
}
