/**
 * RFC 2141 URN formatting
 */

import type { RFC2141URN } from './types';

/**
 * Format RFC 2141 URN to string
 * Format: <NID>:<NSS>
 * Note: Does not include protocol prefix (urn:)
 *
 * @param urn RFC2141URN object
 * @returns Formatted URN string without protocol
 */
export function formatRFC2141(urn: RFC2141URN): string {
  return `${urn.nid.value}:${urn.nss.encoded}`;
}
