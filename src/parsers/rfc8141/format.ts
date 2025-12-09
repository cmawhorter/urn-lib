/**
 * RFC 8141 URN formatting
 */

import type { RFC8141URN } from './types';
import { formatRQF } from './rqf';

/**
 * Format RFC 8141 URN to string
 * Format: <NID>:<NSS>[?+<r-component>][?<q-component>][#<f-component>]
 * Note: Does not include protocol prefix (urn:)
 *
 * @param urn RFC8141URN object
 * @returns Formatted URN string without protocol
 */
export function formatRFC8141(urn: RFC8141URN): string {
  const assignedName = `${urn.nid.value}:${urn.nss.encoded}`;
  const rqfString = formatRQF(urn.rqf);
  return assignedName + rqfString;
}
